let zCounter = 2; // Global z-index counter

class WindowApp {
  constructor(title = "Untitled", content = "") {
    const prototype = document.getElementById('my-window-prototype');
    this.el = prototype.cloneNode(true);
    this.el.id = ''; // prevent duplicate IDs
    this.el.style.display = 'block';
    this.el.querySelector('.title-text').textContent = title;
    this.el.querySelector('.content').innerHTML = content;

    document.getElementById('desktop').appendChild(this.el);

    this.makeInteractive();
    this.focus(); // bring to front on create
  }

  makeInteractive() {
    const win = this.el;
    const titleBar = win.querySelector('.title-bar');
    const minimizeBtn = win.querySelector('.btn.minimize');
    const maximizeBtn = win.querySelector('.btn.maximize');
    const closeBtn = win.querySelector('.btn.close');

    // Focus window on mousedown
    win.addEventListener('mousedown', () => this.focus());

    // Dragging
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    titleBar.addEventListener('mousedown', e => {
      if (e.target.closest('.controls')) return;
      isDragging = true;
      offset.x = win.offsetLeft - e.clientX;
      offset.y = win.offsetTop - e.clientY;
      e.preventDefault();
    });

    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      win.style.left = (e.clientX + offset.x) + 'px';
      win.style.top = (e.clientY + offset.y) + 'px';
    });

    // Controls
    closeBtn.addEventListener('click', () => win.remove());
    minimizeBtn.addEventListener('click', () => win.style.display = 'none');
    maximizeBtn.addEventListener('click', () => {
      win.style.top = '0';
      win.style.left = '0';
      win.style.width = '100%';
      win.style.height = '100%';
    });

    // Resize
    this.enableResizing();
  }

  enableResizing() {
    const win = this.el;
    const directions = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];

    directions.forEach(dir => {
      const handle = win.querySelector(`.resize-handle.${dir}`);
      if (!handle) return;

      handle.addEventListener('mousedown', e => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(getComputedStyle(win).width, 10);
        const startHeight = parseInt(getComputedStyle(win).height, 10);
        const startTop = win.offsetTop;
        const startLeft = win.offsetLeft;

        const resizeMove = (e) => {
          if (dir.includes('e')) win.style.width = (startWidth + e.clientX - startX) + 'px';
          if (dir.includes('s')) win.style.height = (startHeight + e.clientY - startY) + 'px';
          if (dir.includes('w')) {
            const newWidth = startWidth - (e.clientX - startX);
            const newLeft = startLeft + (e.clientX - startX);
            if (newWidth > 100) {
              win.style.width = newWidth + 'px';
              win.style.left = newLeft + 'px';
            }
          }
          if (dir.includes('n')) {
            const newHeight = startHeight - (e.clientY - startY);
            const newTop = startTop + (e.clientY - startY);
            if (newHeight > 100) {
              win.style.height = newHeight + 'px';
              win.style.top = newTop + 'px';
            }
          }
        };

        const stopResize = () => {
          document.removeEventListener('mousemove', resizeMove);
          document.removeEventListener('mouseup', stopResize);
        };

        document.addEventListener('mousemove', resizeMove);
        document.addEventListener('mouseup', stopResize);
      });
    });
  }

  focus() {
    document.querySelectorAll('.window').forEach(w => w.classList.add('inactive'));
    this.el.classList.remove('inactive');
    this.el.style.zIndex = ++zCounter;
  }
}

class WindowManager {
  static openApp(title, contentHTML) {
    new WindowApp(title, contentHTML);
  }
}

document.getElementById('myComputerIcon').addEventListener('dblclick', () => {
  WindowManager.openApp("My Computer", `
    <p>Welcome to your computer</p>
    <ul>
      <li>Documents</li>
      <li>Downloads</li>
      <li>Pictures</li>
    </ul>
  `);
});

document.getElementById('notesIcon').addEventListener('dblclick', () => {
  WindowManager.openApp("Notes", `
    <textarea style="width: 100%; height: 100%; box-sizing: border-box;">Write your notes here...</textarea>
  `);
});

