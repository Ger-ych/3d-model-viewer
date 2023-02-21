const scene = new THREE.Scene(); // Создание новой сцены

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Создание новой камеры с параметрами перспективы

const centerX = 0; // Задание координаты X центра сцены
const centerY = 0; // Задание координаты Y центра сцены
const centerZ = 0; // Задание координаты Z центра сцены

camera.position.set(centerX, centerY, centerZ + 700); // Установка позиции камеры
camera.lookAt(new THREE.Vector3(centerX, centerY, centerZ)); // Направление взгляда камеры на центр сцены

const material = new THREE.MeshPhongMaterial({ // Создание нового материала
  color: 0xffffff, // Задание цвета материала
  specular: 0x555555, // Задание цвета бликов материала
  shininess: 30, // Задание степени блеска материала
});

const mesh = new THREE.Mesh(undefined, material); // Создание новой модели с пустой геометрией и заданным материалом
scene.add(mesh); // Добавление модели в сцену

const loader = new THREE.STLLoader(); // Создание загрузчика STL моделей
const modelInput = document.getElementById('model-input'); // Получение элемента страницы для загрузки модели

modelInput.addEventListener('change', (event) => { // Обработчик события изменения значения элемента
  const file = event.target.files[0]; // Получение выбранного файла
  const fileReader = new FileReader(); // Создание объекта FileReader

  fileReader.onload = () => { // Обработчик события загрузки файла
    const geometry = loader.parse(fileReader.result); // Загрузка геометрии модели с помощью загрузчика
    geometry.computeBoundingBox(); // Вычисление ограничивающего объема геометрии модели
    const bb = geometry.boundingBox;
    const size = new THREE.Vector3();
    bb.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = 500 / maxDimension; // Предполагаем, что 500 - это максимальный размер модели

    mesh.geometry = geometry; // Установка новой геометрии для модели
    mesh.scale.set(scaleFactor, scaleFactor, scaleFactor); // Установка масштаба модели
    mesh.position.set(centerX, centerY, centerZ); // Установка позиции модели
    scene.remove(mesh); // Удаление старой модели из сцены
    scene.add(mesh); // Добавление новой модели в сцену
  };

  fileReader.readAsArrayBuffer(file); // Чтение содержимого файла в буфер
});

// Создание направленных источников света
const light1 = new THREE.DirectionalLight(0xffffff); 
light1.position.set(0, 1000, 1000).normalize();
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff);
light2.position.set(0, 1000, -1000).normalize();
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff);
light3.position.set(0, 1000, 0).normalize();
scene.add(light3);

const light4 = new THREE.DirectionalLight(0xffffff);
light4.position.set(0, -1000, 0).normalize();
scene.add(light4);

// Создание объекта класса THREE.WebGLRenderer() для сцены
const viewer = document.getElementById('viewer'); // Получение элемента для отрисоки сцены на странице
const renderer = new THREE.WebGLRenderer();
viewer.appendChild(renderer.domElement);

// Установка размера окна просмора
function setSceneSize() {
  const viewerRect = viewer.getBoundingClientRect();
  camera.aspect = viewerRect.width / viewerRect.height;
  camera.updateProjectionMatrix();
  renderer.setSize(viewerRect.width, viewerRect.height);
}

setSceneSize();
window.addEventListener('resize', setSceneSize);

// Установка элементов управления просмотром 3D-модели
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.5;
controls.minDistance = 200;
controls.maxDistance = 700;

// Функция рендеринга сцены
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Рендеринг сцены
animate();
