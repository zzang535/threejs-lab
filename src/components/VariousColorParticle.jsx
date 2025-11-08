import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect, useRef } from "react";
import starImage from "../images/star.png";

// ----- 주제: 여러가지 색의 파티클
// VariousColorParticle

export default function VariousColorParticle() {
  const rendererRef = useRef(null); // 랜더러 참조

  useEffect(() => {
    // Renderer
    // const canvas = document.querySelector("#three-canvas");
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
    controls.enableDamping = true;

    // Points
    const geometry = new THREE.BufferGeometry(); // 버퍼 지오메트리, 모양 없음
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 10; // -0.5 - 0.5 range
      colors[i] = Math.random();
    }

    // 위치 삽입
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // 컬러 삽입
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // 이미지 로드
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(starImage);

    const material = new THREE.PointsMaterial({
      size: 0.1,
      // color: "green",

      // 이미지 맵핑
      map: particleTexture,

      // 파티클 이미지 투명하게 사용하는 옵션
      transparent: true,
      alphaMap: particleTexture,
      depthWrite: false,

      // 색상
      vertexColors: true,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
      const delta = clock.getDelta();

      controls.update();

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
