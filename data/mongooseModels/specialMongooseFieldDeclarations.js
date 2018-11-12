// генерируем поле используемое для хранине картинки
const picture = {
  caption: {
    uk: String,
    ru: String,
    en: String,
  },
  // в каких полях используется данная картинка
  engaged: [String],
  height: {
    type: Number,
    required: true,
  },
  md5Hash: {
    type: String,
    required: true,
  },
  initialName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
};

// ---------------------------------------------------------------
// все возможные специальные поля (с заранее заданными названиями)

// массив картинок
export const pictures = {
  type: [picture],
};
// уникальная (совместно с определенными параметрами) строка
// для задания thing в строке браузера
export const slug = {
  type: String,
  trim: true,
};
