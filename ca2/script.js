document.addEventListener("DOMContentLoaded", function () {
    var path = window.location.pathname;
    var host = window.location.hostname;
    var isLocalhost = (host === 'localhost' || host === '127.0.0.1' || host === '');

    // For GitHub Pages, don't include port
    var qrHost = host;
    var qrUrl = window.location.protocol + '//' + qrHost + path;

    // If localhost, try to fetch the network IP
    if (isLocalhost) {
        fetch('/get-network-ip')
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Network IP not available');
            })
            .then(networkIp => {
                // Clean up the IP (remove whitespace and validate)
                networkIp = networkIp.trim();
                
                // Check if it's a valid IP and not localhost
                if (networkIp &&
                    networkIp !== '127.0.0.1' &&
                    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(networkIp)) {
                    
                    qrUrl = window.location.protocol + '//' + networkIp + path;
                    document.getElementById('qr-url-text').innerText = qrUrl;
                    document.getElementById('qr-hint-text').innerText = '✅ Ready for mobile AR scanning!';
                    
                    // Regenerate QR code with network IP
                    document.getElementById('qrcode').innerHTML = '';
                    new QRCode(document.getElementById("qrcode"), {
                        text: qrUrl,
                        width: 150,
                        height: 150,
                        colorDark: "#5D4E37",
                        colorLight: "#F5EDDC",
                        correctLevel: QRCode.CorrectLevel.M
                    });
                } else {
                    throw new Error('Invalid network IP');
                }
            })
            .catch((error) => {
                console.log('Using localhost for QR code:', error.message);
                // Fallback if fetch fails
                document.getElementById('qr-hint-text').innerText = '💡 For mobile AR, use the Network URL from the Python server console.';
            });
    } else {
        document.getElementById('qr-hint-text').innerText = '✅ Ready for mobile AR scanning!';
    }

    document.getElementById('qr-url-text').innerText = qrUrl;

    new QRCode(document.getElementById("qrcode"), {
        text: qrUrl,
        width: 150,
        height: 150,
        colorDark: "#5D4E37",
        colorLight: "#F5EDDC",
        correctLevel: QRCode.CorrectLevel.M
    });

    // Model viewer events
    const modelViewer = document.querySelector('model-viewer');
    
    modelViewer.addEventListener('load', () => {
        console.log('✅ 3D Model loaded successfully');
    });
    
    modelViewer.addEventListener('error', (event) => {
        console.error('❌ Error loading 3D model:', event);
    });

    // Auto-hide controls on ALL devices after 5 seconds
    const controlsInfo = document.querySelector('.controls-info');
    
    setTimeout(() => {
        if (controlsInfo) {
            controlsInfo.classList.add('hidden');
        }
    }, 5000); // Hide controls after 5 seconds

    // Show controls again on tap/interaction
    const viewerContainer = document.querySelector('.viewer-container');
    viewerContainer.addEventListener('click', () => {
        if (controlsInfo && controlsInfo.classList.contains('hidden')) {
            controlsInfo.classList.remove('hidden');
            
            // Hide controls again after 5 seconds
            setTimeout(() => {
                controlsInfo.classList.add('hidden');
            }, 5000);
        }
    });

    // Minimize/maximize info panel functionality
    const infoPanel = document.querySelector('.info-panel');
    const minimizeBtn = document.querySelector('.minimize-btn');
    
    if (minimizeBtn && infoPanel) {
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            infoPanel.classList.toggle('minimized');
            minimizeBtn.textContent = infoPanel.classList.contains('minimized') ? '▲' : '▼';
        });

        // Click on minimized panel to expand
        infoPanel.addEventListener('click', () => {
            if (infoPanel.classList.contains('minimized')) {
                infoPanel.classList.remove('minimized');
                minimizeBtn.textContent = '▼';
            }
        });
    }

    // Model switcher functionality with 3 models
    const models = [
        { file: 'final_hexmesh.glb', name: 'Final Model (Hex Meshing)' },
        { file: 'final_hexmesh_statics.glb', name: 'Static Analysis (Hex Mesh)' },
        { file: 'a03_design-project.glb', name: 'Old Model (Quad Meshing)' }
    ];
    let currentModelIndex = 0; // Start with final_hexmesh.glb
    
    // Get the button and label from the header
    const switcherButton = document.getElementById('model-switcher');
    const modelNameSpan = document.getElementById('model-name');
    
    // Cycle through models
    switcherButton.addEventListener('click', () => {
        // Move to next model
        currentModelIndex = (currentModelIndex + 1) % models.length;
        const nextModel = models[currentModelIndex];
        
        // Update model viewer
        modelViewer.src = nextModel.file;
        
        // Update label
        modelNameSpan.textContent = nextModel.name;
        
        // Reset camera to center on the new model after it loads
        modelViewer.addEventListener('load', function recenterCamera() {
            // Reset camera orbit to default position
            modelViewer.resetTurntableRotation();
            modelViewer.cameraOrbit = '180deg 70deg auto';
            modelViewer.fieldOfView = '45deg';
            
            // Frame the model to fit in view
            modelViewer.jumpCameraToGoal();
            
            // Remove this listener after it fires once
            modelViewer.removeEventListener('load', recenterCamera);
        }, { once: true });
    });
});

// Made with Bob
