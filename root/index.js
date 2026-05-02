var Typer = {
  text: '',
  accessCountimer: null,
  index: 0,
  speed: 2,
  file: '',
  accessCount: 0,
  deniedCount: 0,
  init: function () {
    accessCountimer = setInterval(function () {
      Typer.updLstChr();
    }, 500);
    fetch(Typer.file)
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        Typer.text = data;
        Typer.text = Typer.text.slice(0, Typer.text.length - 1);
      });
  },

  content: function () {
    return document.getElementById('console').innerHTML;
  },

  write: function (str) {
    document.getElementById('console').innerHTML += str;
    return false;
  },

  addText: function (key) {
    if (key.keyCode == 18) {
      Typer.accessCount++;

      if (Typer.accessCount >= 3) {
        Typer.makeAccess();
      }
    } else if (key.keyCode == 20) {
      Typer.deniedCount++;

      if (Typer.deniedCount >= 3) {
        Typer.makeDenied();
      }
    } else if (key.keyCode == 27) {
      Typer.hidepop();
    } else if (Typer.text) {
      var cont = Typer.content();
      if (cont.substring(cont.length - 1, cont.length) == '|')
        document.getElementById('console').innerHTML = 
          document.getElementById('console').innerHTML.substring(0, cont.length - 1);
      if (key.keyCode != 8) {
        Typer.index += Typer.speed;
      } else {
        if (Typer.index > 0) Typer.index -= Typer.speed;
      }
      var text = Typer.text.substring(0, Typer.index);
      var rtn = new RegExp('\n', 'g');

      document.getElementById('console').innerHTML = text.replace(rtn, '<br/>');
      window.scrollBy(0, 50);
    }

    if (key.preventDefault && key.keyCode != 122) {
      key.preventDefault();
    }

    if (key.keyCode != 122) {
      key.returnValue = false;
    }
  },

  updLstChr: function () {
    var cont = this.content();

    if (cont.substring(cont.length - 1, cont.length) == '|')
      document.getElementById('console').innerHTML = 
        document.getElementById('console').innerHTML.substring(0, cont.length - 1);
    else this.write('|');
  },
};

function replaceUrls(text) {
  var http = text.indexOf('http://');
  var space = text.indexOf('.me ', http);

  if (space != -1) {
    var url = text.slice(http, space - 1);
    return text.replace(url, '<a href="' + url + '">' + url + '</a>');
  } else {
    return text;
  }
}

// Retro Mode Toggle
var RetroMode = {
  isRetroMode: false,
  storageKey: 'retro-mode-enabled',
  
  init: function() {
    var button = document.getElementById('retro-toggle');
    if (!button) return;
    
    // Load saved preference
    var savedMode = localStorage.getItem(this.storageKey);
    if (savedMode === 'true') {
      this.enableRetroMode();
    }
    
    // Add click event
    var self = this;
    button.addEventListener('click', function() {
      self.toggle();
    });
  },
  
  toggle: function() {
    if (this.isRetroMode) {
      this.disableRetroMode();
    } else {
      this.enableRetroMode();
    }
  },
  
  enableRetroMode: function() {
    document.body.classList.add('retro-mode');
    this.isRetroMode = true;
    var toggleText = document.querySelector('.toggle-text');
    if (toggleText) toggleText.textContent = '✨ Modern';
    localStorage.setItem(this.storageKey, 'true');
  },
  
  disableRetroMode: function() {
    document.body.classList.remove('retro-mode');
    this.isRetroMode = false;
    var toggleText = document.querySelector('.toggle-text');
    if (toggleText) toggleText.textContent = '🕹️ Retro';
    localStorage.setItem(this.storageKey, 'false');
  }
};

// Initialize everything
Typer.speed = 3;
Typer.file = 'codenerve.txt';
Typer.init();

var timer = setInterval('t();', 30);
function t() {
  Typer.addText({ keyCode: 123748 });

  if (Typer.index > Typer.text.length) {
    clearInterval(timer);
  }
}

// Initialize retro mode when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    RetroMode.init();
  });
} else {
  RetroMode.init();
}

// Made with Bob
