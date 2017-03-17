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
    ],
    ambientLight: {
        intensity: 0.99,
        color: 0xffffff,
        position: {
            x: 0,
            y: 0,
            z: 400
        },
        name: 'ambientLight'
    },

    sun: {
        size: 100,
        color: 0x222222
    },
    planets: [
        {
            name: 'first',
            orbitInSuns: 8,
            color: 0x28dc52,
            orbitPeriod: 32,
            size: 35
        },
        {
            name: 'second',
            orbitInSuns: 4,
            color: 0x2828dc,
            orbitPeriod: 88,
            size: 49
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
    gui.addColor(values.sun, 'color').onChange(() => {
        let sun = scene.getObjectByName('sun');
        if (sun) {
            sun.material.color.set(values.sun.color);
        }
    });

    values.planets.forEach((planet) => {
        let planetFolder = gui.addFolder(planet.name);
        planetFolder.addColor(planet, 'color').onChange(() => {
            let orb = scene.getObjectByName(planet.name);
            if (orb) {
                orb.material.color.set(planet.color);
            }
        });
    });

    values.lights.forEach((light) => {
        let folder = gui.addFolder(light.name);
        folder.addColor(light, 'color').onChange(() => {
            scene.getObjectByName(light.name).color.set(light.color);
        });
        folder.add(light, 'intensity', 0, 1).onChange(() => {
            scene.getObjectByName(light.name).intensity = light.intensity;
        })
    });

    let folder = gui.addFolder('ambient');
    folder.addColor(values.ambientLight, 'color').onChange(() => {
        scene.getObjectByName('ambientLight').color.set(values.ambientLight.color);
    });
    folder.add(values.ambientLight, 'intensity', 0, 1).onChange(() => {
        scene.getObjectByName('ambientLight').intensity = values.ambientLight.intensity;
    })

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

    // let mesh = new THREE.Mesh(
    //     new THREE.BoxGeometry(10, 10, 10),
    //     new THREE.MeshLambertMaterial({ color: values.squareColor })
    // );

    // mesh.name = 'myBox';
    // scene.add(mesh);

    createSun();
    createPlanets();

    // let mesh = new THREE.Mesh(
    //     new THREE.BoxGeometry(10, 10, 10),
    //     new THREE.MeshLambertMaterial({ color: values.squareColor })
    // );
    // mesh.name = 'myBox';
    // scene.add(mesh);
}

function createSun() {
    // let mesh = new THREE.Mesh(
    //     new THREE.SphereGeometry(values.sun.size, 64, 64),
    //     new THREE.MeshPhongMaterial({ color: values.sun.color })
    // );
    // mesh.name = 'sun';
    // scene.add(mesh);

    // lighting of sun
    let sunGeometry = new THREE.SphereGeometry(values.sun.size, 64, 64);
    let sunLight = new THREE.PointLight(0xffee88, 1, 0, .000001);
    let sunMat = new THREE.MeshStandardMaterial({
        emissive: 0xff0000,
        emissiveIntensity: 1,
        color: 0x0000ff
    });
    let mesh = new THREE.Mesh(sunGeometry, sunMat);
    mesh.name = 'sun';
    sunLight.add(mesh);
    //sunLight.position.set(0, 2, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);
}


function createPlanets() {
    // let i = 1;
    // values.planets.forEach((planet) => {
    //     let orb = new THREE.SphereGeometry(planet.size, 64, 64);
    //     //orb.translate(planet.orbitInSuns * i++);
    //     orb.translate(planet.orbitInSuns * values.sun.size, 0, 0);
    //     let mesh = new THREE.Mesh(
    //         orb,
    //         new THREE.MeshPhongMaterial({ color: planet.color })
    //     );
    //     mesh.name = planet.name;
    //     scene.add(mesh);
    // });

    createEarth();

}

function createEarth() {






    // Create a group to contain Earth and Clouds
    let earthGroup = new THREE.Object3D();

    let surfaceMap = THREE.ImageUtils.loadTexture("./images/earth_surface_2048.jpg");
    let normalMap = THREE.ImageUtils.loadTexture("./images/earth_normal_2048.jpg");
    let specularMap = THREE.ImageUtils.loadTexture("./images/earth_specular_2048.jpg");

    let shader = THREE.ShaderLib["normal"];
    let uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    uniforms.normalMap.value = normalMap;
    uniforms.diffuse.value = surfaceMap;
    uniforms.specularMap.value = specularMap;

    uniforms.enableDiffuse = true;
    uniforms.enableSpecular = true;

    let shaderMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: uniforms,
        lights: true
    });

    let testMaterial = new THREE.MeshBasicMaterial({ map: surfaceMap });


    let globeGeometry = new THREE.SphereGeometry(40, 32, 32);
    globeGeometry.translate(3 * values.sun.size, 0, 0);


    // We'll need these tangents for our shader
    globeGeometry.computeTangents();
    let globeMesh = new THREE.Mesh(globeGeometry, shaderMaterial);
    //let globeMesh = new THREE.Mesh(globeGeometry, testMaterial);

    // Let's work in the tilt
    globeMesh.rotation.z = Earth.TILT;

    addClouds(globeMesh);
    // Add it to our group
    earthGroup.add(globeMesh);
    scene.add(earthGroup);
    // Save it away so we can rotate it
    this.globeMesh = globeMesh;

    // // Create our Earth with nice texture
    // // todo: make this config
    // let earthmap = "./images/earth_surface_2048.jpg";
    // let geometry = new THREE.SphereGeometry(40, 32, 32);
    // geometry.translate(3 * values.sun.size, 0, 0);

    // let texture = THREE.ImageUtils.loadTexture(earthmap);
    // let material = new THREE.MeshBasicMaterial({ map: texture });
    // let earthMesh = new THREE.Mesh(geometry, material);
    // earthMesh.scale = new THREE.Vector3(40, 40, 40);
    // // Let's work in the tilt
    // // todo: make this config
    // earthMesh.rotation.z = 0.41;

    // scene.add(earthMesh);

}

function addClouds(planet) {
    // Create our clouds
    var cloudsMap = THREE.ImageUtils.loadTexture("./images/earth_clouds_1024.png");
    var cloudsMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: cloudsMap,
        transparent: true
    });

    var cloudsGeometry = new THREE.SphereGeometry(Earth.CLOUDS_SCALE, 32, 32);
    cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMesh.rotation.z = Earth.TILT;

    // Add it to our group
    planet.add(cloudsMesh);
}



function updateGeometries() {
    // scene.children.forEach(c => {
    //     c.rotation.x += .005;
    //     c.rotation.y += .001;
    // });
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
    let ambient = new THREE.AmbientLight(values.ambientLight.color, values.ambientLight.intensity);
    ambient.name = 'ambientLight';
    scene.add(ambient);
}

function updateLighting() {

}

function setupCamera() {
    camera.position.x = 341;
    camera.position.y = 160
    camera.position.z = -20;
    camera.focalLength = 21.65;
}

function updateCamera() {
}

function vec3ToString(vec) {
    return (`${vec.x},${vec.y},${vec.z}`);
}