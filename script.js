document.addEventListener("DOMContentLoaded", () => {
  const uploadArea = document.getElementById("upload-area");
  const imageInput = document.getElementById("imageInput");
  const removeBackgroundBtn = document.getElementById("removeBackgroundBtn");
  const resetBtn = document.getElementById("resetBtn"); // New reset button
  const result = document.getElementById("result");

  let selectedFile = null;

  // Open file input on click
  uploadArea.addEventListener("click", () => imageInput.click());

  // Handle file drop
  uploadArea.addEventListener("dragover", (e) => e.preventDefault());
  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  });

  // Handle file selection
  imageInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

  function handleFile(file) {
    if (file && file.type.startsWith("image/")) {
      selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => displayImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  }

  function displayImage(imageSrc) {
    result.innerHTML = `<img src="${imageSrc}" alt="Original Image">`;
    result.classList.add("loaded");
  }

  removeBackgroundBtn.addEventListener("click", () => {
    if (selectedFile) {
      removeBackground(selectedFile);
    } else {
      alert("Please upload an image first.");
    }
  });

  async function removeBackground(file) {
    const apiKey = "KjRSNg5j2thmvTry3iUJbtnJ";

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    result.innerHTML = "<p>Removing background...</p>";

    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to remove background");

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      result.innerHTML = `<img src="${imageUrl}" alt="Background Removed">`;

      // Add the download button
      const downloadBtn = document.createElement("button");
      downloadBtn.innerText = "Download Image";
      downloadBtn.classList.add("download-btn");
      downloadBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "background_removed.png";
        link.click();
      });
      result.appendChild(downloadBtn);
    } catch (error) {
      console.error(error);
      result.innerHTML = "<p>Error removing background. Please try again.</p>";
    }
  }

  // Reset button functionality
  resetBtn.addEventListener("click", () => {
    selectedFile = null;
    result.innerHTML = "<p>No Image Processed Yet</p>";
    imageInput.value = ""; // Clear the input file
  });
});
