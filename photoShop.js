const fileInput = document.querySelector(".file-input"),
  filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"), //value kısmını ayarlama
  filterSlider = document.querySelector(".slider  input"), //slider kısmını ayarlama
  rotateOptions = document.querySelectorAll(".rotate button"), //döndürme
  resetFilterBtn = document.querySelector(".reset-filter"), //sıfırlama butonu
  chooseImgBtn = document.querySelector(".choose-img"),
  saveImgBtn = document.querySelector(".save-img"),
  previewImg = document.querySelector(".preview-img img");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0; //varsayılan parlaklık doygunluk 100 olacak gibi...
let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilters = () => {
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`; //filtre ayarlama
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
};

const loadImage = () => {
  let file = fileInput.files[0]; //kullanıcı tarafından seçilen dosya alınır
  if (!file) return; //kullanıcı dosyayı seçmediyse geri dön
  previewImg.src = URL.createObjectURL(file); //dosya url'sini önizleme img src olarak geçirme.resimler ekranda gözükür
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click(); //kullanıcı yeni img seçerse filtre değerinin sıfırlanması için btn'yi sıfırla'yı tıklatmak
    document.querySelector(".container").classList.remove("disable"); //ekran ilk açıldığında sadece choose ımage kısmı kullanılabilir resim yüklenince bütün butonlar aktif hale gelir.
  });
};
filterOptions.forEach((option) => {
  //tüm filtre düğmelerine tıklama olay dinleyicisi ekleme
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active"); //filter kısmında üzerine tıklanılan butonu aktif eder ve onun rengi değişir
    filterName.innerText = option.innerText; //seçtiğin kutunun ismini yazar

    //seçilen filtre değerini butonu değiştirip geri döndüğümüzde de gösterir
    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});
const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`; //boyut ayarlama kısmındaki slider küçültüp büyütünce rakamın ona göre değişmesi
  const selectedFilter = document.querySelector(".filter .active"); //filtre butonu seçiliyor

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilters();
};

rotateOptions.forEach((option) => {
  //tüm döndürme/çevirme düğmelerine tıklama olay dinleyicisi ekleme
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90; //düğme tıklanırsa sola döndür döndürme değerini -90 azalt
    } else if (option.id === "right") {
      rotate += 90; //düğme tıklanırsa sağa döndür döndürme değerini +90 arttır
    } else if (option.id === "horizontal") {
      //fliphorizontal değer 1 ise bu değeri -1 olarak ayarlayın, aksi takdirde 1 olarak ayarlayın
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      //flipvertical değer 1 ise bu değeri -1 olarak ayarlayın, aksi takdirde 1 olarak ayarlayın
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

const resetFilter = () => {
  //tüm değişken değerini varsayılan değerine sıfırlama
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click(); //varsayılan olarak seçilen parlaklık için parlaklık düğmesine tıklamak. yani reset butonuna tıkladığında filtreler varsayılana döner
  applyFilters();
};

const saveImage = () => {
  const canvas = document.createElement("canvas"); //tuval öğesi oluşturma
  const ctx = canvas.getContext("2d"); //canvas.getcontext tuval üzerinde bir çizim bağlamı döndürür
  canvas.width = previewImg.naturalWidth; //tuval genişliğini gerçek görüntü genişliğine ayarlamak
  canvas.height = previewImg.naturalHeight; //tuval yüksekliğini gerçek görüntü yüksekliğine ayarlama

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`; //kullanıcı tarafından seçilen filtreleri tuval filtresine uygulama
  ctx.translate(canvas.width / 2, canvas.height / 2); //tuvali merkezden çevirme
  if (rotate !== 0) {
    //döndürme değeri 0 değilse tuvali döndür
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical); //Kullanıcı tarafından seçilen çevirmeyi tuval resmine uygulama
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  ); //drawimage, tuval üzerine bir resim çizmek için farklı yollar sunar
  const link = document.createElement("a"); //<a> öğesi oluşturuluyor
  link.download = "neospaintappimage.jpg"; //<a> etiketi indirme değerini "image.jpg" dosyasına geçirme

  // todataurl, görüntünün temsilini içeren bir veri url'si döndürür
  link.href = canvas.toDataURL(); //<a> etiketi href değerini tuval veri url'sine geçirme

  link.click(); //<a> etiketine tıklayarak görüntünün indirilmesini sağlayın
};
fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click()); //choose Image butonuna tıkladığında resim seçme kısmı açılıyor
