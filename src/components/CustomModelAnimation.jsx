// module
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ----- 주제: 커스텀 모델 애니메이션
// 커스텀 모델 애니메이션

export default function CustomModelAnimation() {
  const rendererRef = useRef(null); // 랜더러 참조

  useEffect(() => {
    // Renderer
    const renderer = new THREE.WebGLRenderer({
      // ref 로 랜더링시에는 canvas 직접 넣을 필요 없음
      // canvas,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    rendererRef.current.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.y = 1.5;
    camera.position.z = 4;
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight("white", 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.x = 1;
    directionalLight.position.z = 2;
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // gltf loader
    const gltfLoader = new GLTFLoader();
    let mixer;

    gltfLoader.load("/models/ilbuni-with-animation.glb", (gltf) => {
      console.log(gltf.scene.children[0]);
      const ilbuniMesh = gltf.scene.children[0];
      scene.add(ilbuniMesh);

      // 애니메이션 세팅
      mixer = new THREE.AnimationMixer(ilbuniMesh);
      const actions = [];
      actions[0] = mixer.clipAction(gltf.animations[0]);
      actions[1] = mixer.clipAction(gltf.animations[1]);
      actions[0].repetitions = 2; // 반복 회수 설정
      actions[0].clampWhenFinished = true; // 애니메이션 끝난 상태에서 멈추도록 하기
      actions[1].play();
    });

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
      const delta = clock.getDelta();

      // mixer 업데이트 계속 해줘야함
      // mixer 가 모두 로드된 후에 실행되도록 처리해야함
      if (mixer) mixer.update(delta);

      renderer.render(scene, camera);
      renderer.setAnimationLoop(draw);
    }

    function setSize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    // 이벤트
    window.addEventListener("resize", setSize);

    draw();
  }, []);
  return <div ref={rendererRef}></div>;
}
