(function () {
  var files = [];
  var outputFormat = "jpeg";
  var quality = 0.7;
  var processing = false;
  var allProcessed = false;
  var toggleClickCount = 0;
  var toggleClickTimer = null;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("file-input");
  var imageSection = document.getElementById("image-section");
  var imageList = document.getElementById("image-list");
  var btnProcess = document.getElementById("btn-process");
  var formatSelect = document.getElementById("format-select");
  var qualityRange = document.getElementById("quality-range");
  var qualityValue = document.getElementById("quality-value");
  var qualityGroup = document.getElementById("quality-group");
  var darkToggle = document.getElementById("dark-toggle");
  var toggleMessage = document.getElementById("toggle-message");

  function formatSize(bytes) {
    if (bytes === null || bytes === undefined) return "N/A";
    var units = ["B", "KB", "MB"];
    var size = bytes;
    var i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return size.toFixed(1) + " " + units[i];
  }

  function calculateReduction(file) {
    if (!file.optimizedSize || !file.originalSize || file.originalSize === 0) return 0;
    var raw = ((file.originalSize - file.optimizedSize) / file.originalSize) * 100;
    return Math.max(0, raw).toFixed(1);
  }

  function renderFileList() {
    if (files.length === 0) {
      imageSection.classList.add("hidden");
      return;
    }
    imageSection.classList.remove("hidden");

    var html = "";
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      html += '<div class="image-card">';
      html += '<img src="' + f.preview + '" alt="">';
      html += '<div class="image-info">';
      html += '<div class="image-name">' + escapeHtml(f.name) + "</div>";
      html += '<div class="image-size">' + formatSize(f.originalSize) + "</div>";
      if (f.optimizedSize) {
        html += '<div class="image-reduction">Reduced by ' + calculateReduction(f) + "%</div>";
      }
      html += "</div>";
      html += '<div class="image-actions">';
      if (f.optimizedBlob) {
        html += '<button class="btn-download" data-action="download" data-index="' + i + '">Download</button>';
      }
      html += '<button class="btn-remove" data-action="remove" data-index="' + i + '" title="Remove">';
      html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>';
      html += "</button>";
      html += "</div>";
      html += "</div>";
    }
    imageList.innerHTML = html;
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function updateButton() {
    if (files.length === 0) {
      btnProcess.textContent = "Process All";
      btnProcess.disabled = true;
      return;
    }
    btnProcess.disabled = processing;
    if (processing) {
      btnProcess.textContent = "Processing...";
    } else if (allProcessed) {
      btnProcess.textContent = "Download All (.zip)";
    } else {
      btnProcess.textContent = "Process All";
    }
  }

  function resetOptimizationStatus() {
    for (var i = 0; i < files.length; i++) {
      files[i].optimizedBlob = null;
      files[i].optimizedSize = null;
    }
    allProcessed = false;
    updateButton();
    renderFileList();
  }

  function addFiles(newFiles) {
    var imageFiles = [];
    for (var i = 0; i < newFiles.length; i++) {
      if (newFiles[i].type.startsWith("image/")) {
        imageFiles.push(newFiles[i]);
      }
    }
    if (imageFiles.length === 0) return;

    var loaded = 0;
    allProcessed = false;

    for (var j = 0; j < imageFiles.length; j++) {
      (function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          files.push({
            file: file,
            name: file.name,
            originalSize: file.size,
            preview: e.target.result,
            optimizedBlob: null,
            optimizedSize: null,
          });
          loaded++;
          if (loaded === imageFiles.length) {
            renderFileList();
            updateButton();
          }
        };
        reader.readAsDataURL(file);
      })(imageFiles[j]);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    dropzone.classList.remove("active");
    addFiles(Array.from(e.dataTransfer.files));
  }

  function handleFileSelect(e) {
    if (e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
    e.target.value = "";
  }

  async function optimizeImage(index) {
    var file = files[index].file;
    var img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise(function (resolve) {
      img.onload = resolve;
    });

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    var mimeType = "image/" + outputFormat;
    var blob = await new Promise(function (resolve) {
      canvas.toBlob(resolve, mimeType, outputFormat === "png" ? undefined : quality);
    });

    if (outputFormat === "jpeg" && blob.size > file.size) {
      files[index].optimizedBlob = file;
      files[index].optimizedSize = file.size;
      files[index].outputFormat = "jpeg";
    } else {
      files[index].optimizedBlob = blob;
      files[index].optimizedSize = blob.size;
      files[index].outputFormat = outputFormat;
    }

    URL.revokeObjectURL(img.src);
  }

  async function processAllImages() {
    processing = true;
    allProcessed = false;
    updateButton();

    for (var i = 0; i < files.length; i++) {
      if (!files[i].optimizedBlob) {
        await optimizeImage(i);
      }
    }

    processing = false;
    allProcessed = files.length > 0 && files.every(function (f) {
      return f.optimizedBlob;
    });
    updateButton();
    renderFileList();
  }

  function downloadOptimizedImage(index) {
    var f = files[index];
    if (!f.optimizedBlob) return;
    var ext = f.outputFormat || "jpg";
    var originalName = f.name.substring(0, f.name.lastIndexOf(".")) || f.name;
    var link = document.createElement("a");
    link.href = URL.createObjectURL(f.optimizedBlob);
    link.download = "optimized-" + originalName + "." + ext;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function downloadAllImages() {
    var zip = new JSZip();
    var hasFiles = false;

    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (f.optimizedBlob) {
        var ext = f.outputFormat || "jpg";
        var originalName = f.name.substring(0, f.name.lastIndexOf(".")) || f.name;
        zip.file("optimized-" + originalName + "." + ext, f.optimizedBlob);
        hasFiles = true;
      }
    }

    if (!hasFiles) {
      alert("No optimized files to download.");
      return;
    }

    var zipBlob = await zip.generateAsync({ type: "blob" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = "optimized-images.zip";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function removeFile(index) {
    files.splice(index, 1);
    allProcessed = files.length > 0 && files.every(function (f) {
      return f.optimizedBlob;
    });
    renderFileList();
    updateButton();
  }

  function initDarkMode() {
    var stored = localStorage.getItem("smolpDarkMode");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = stored === "true" || (!stored && prefersDark);
    if (!isDark) {
      document.documentElement.classList.add("light");
    }
  }

  function toggleDarkMode() {
    var isLight = document.documentElement.classList.toggle("light");
    localStorage.setItem("smolpDarkMode", !isLight);

    toggleClickCount++;
    if (toggleClickTimer) clearTimeout(toggleClickTimer);

    if (toggleClickCount >= 5) {
      toggleMessage.classList.add("visible");
      setTimeout(function () {
        toggleMessage.classList.remove("visible");
      }, 3000);
      toggleClickCount = 0;
    }

    toggleClickTimer = setTimeout(function () {
      toggleClickCount = 0;
    }, 3000);
  }

  dropzone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropzone.classList.add("active");
  });

  dropzone.addEventListener("dragleave", function (e) {
    e.preventDefault();
    dropzone.classList.remove("active");
  });

  dropzone.addEventListener("drop", handleDrop);

  dropzone.addEventListener("click", function (e) {
    if (e.target.tagName !== "LABEL") {
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", handleFileSelect);

  formatSelect.addEventListener("change", function () {
    outputFormat = formatSelect.value;
    var isPng = outputFormat === "png";
    if (isPng) {
      qualityGroup.classList.add("disabled");
    } else {
      qualityGroup.classList.remove("disabled");
    }
    qualityRange.disabled = isPng;
    qualityValue.textContent = isPng ? "Lossless" : Math.round(quality * 100) + "%";
    resetOptimizationStatus();
  });

  qualityRange.addEventListener("input", function () {
    quality = parseFloat(qualityRange.value);
    qualityValue.textContent = Math.round(quality * 100) + "%";
    resetOptimizationStatus();
  });

  btnProcess.addEventListener("click", function () {
    if (allProcessed) {
      downloadAllImages();
    } else {
      processAllImages();
    }
  });

  darkToggle.addEventListener("click", toggleDarkMode);

  imageList.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    var index = parseInt(btn.getAttribute("data-index"), 10);
    if (action === "download") {
      downloadOptimizedImage(index);
    } else if (action === "remove") {
      removeFile(index);
    }
  });

  initDarkMode();
  updateButton();
})();
