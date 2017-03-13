var scene, camera, renderer, cameraControls;
var gui;
var values = {
    squareColor: 0x22ccddd,
    lights: [
        {
            intensity: 0.5,
            color: 0xffffff,
            position: {
                x: 0,
                y: 0,
                z: 400
            },
            name: 'light1'
        },
        {
            intensity: 0.7,
            color: 0xffffff,
            position: {
                x: 0,
                y: 400,
                z: 0
            },
            name: 'light2'
        },
        {
            intensity: 0.9,
            color: 0xffffff,
            position: {
                x: 400,
                y: 0,
                z: 0
            },
            name: 'light3'
        }
    ]
};

var render = function () {
    requestAnimationFrame(render);
    updateScene();
    renderer.render(scene, camera);
};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.addEventListener('change', function () { renderer.render(scene, camera); });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    document.body.appendChild(renderer.domElement);

    createGUI();
    createScene();
}

function createGUI() {
    var gui = new dat.GUI();
    gui.addColor(values, 'squareColor').onChange(() => {
        let box = scene.getObjectByName('myBox');
        if (box) {
            box.material.color.set(values.squareColor);
        }
    });

    values.lights.forEach((light) => {
        let folder = gui.addFolder(light.name);
        folder.addColor(light, 'color').onChange(() => {
            scene.getObjectByName(light.name).color.set(light.color);
        });
        folder.add(light, 'intensity',0,1).onChange(() => {
            scene.getObjectByName(light.name).intensity = light.intensity;
        })
    });

}

function createScene() {
    setupLighting();
    setupCamera();
    createGeometries();
}

function updateScene() {
    updateGeometries();
    updateLighting();
    updateCamera();
}

function createGeometries() {
    let mesh = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.MeshLambertMaterial({ color: values.squareColor })
    );

    mesh.name = 'myBox';
    scene.add(mesh);
}

function updateGeometries() {
    scene.children.forEach(c => {
        c.rotation.x += .05;
        c.rotation.y += .1;
    });
}


function setupLighting() {
    let lights = new THREE.Group();
    lights.name = 'lights';
    values.lights.forEach((light) => {
        let lite = new THREE.PointLight(light.color, light.intensity);
        lite.position.set(light.position.x, light.position.y, light.position.z);
        lite.name = light.name;
        lights.add(lite);
    });

    scene.add(lights);
    scene.add(new THREE.AmbientLight(0xff9999, 0.7));
}

function updateLighting() {

}

function setupCamera() {
    camera.position.z = 100;
}

function updateCamera() {
}

function vec3ToString(vec) {
    return (`${vec.x},${vec.y},${vec.z}`);
}