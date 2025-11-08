// module
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "../utils/PreventDragClick";
import { MySphere } from "../utils/MySphere";
import mySound from "../sounds/boing.mp3";

// ----- 주제: ObjectRemove
// 오브젝트 제거

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

export default function ObjectRemove() {
  const rendererRef = useRef(null); // 랜더러 참조
  const sceneRef = useRef(null); // 신 참조

  useEffect(() => {
    console.log("useEffect", useEffect);

    // Renderer
    // const canvas = document.querySelector("#three-canvas");
    const renderer = new THREE.WebGLRenderer({
      // ref 로 랜더링시에는 canvas 직접 넣을 필요 없음
      // canvas,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true; // 그림자
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자 부드럽게
    rendererRef.current.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.y = 1.5;
    camera.position.z = 4;
    sceneRef.current.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight("white", 0.5);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.x = 1;
    directionalLight.position.z = 2;
    directionalLight.castShadow = true; // 그림자
    sceneRef.current.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Cannon (물리 엔진)
    const cannonWorld = new CANNON.World();
    cannonWorld.gravity.set(0, -10, 0);

    // 성능을 위한 세팅
    cannonWorld.allowSleep = true; // body 가 엄청 느려지면 각 객체들 테스트 안함
    cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld); // 적절히 성능을 타협하는 세팅
    // CANNON.SAPBroadphase // 제일 좋음
    // CANNON.NaiveBroadphase // 기본값
    // CANNON.GridBroadphase // 구역을 나누어 테스트

    // Contact Meterial
    const defaultMaterial = new CANNON.Material("default");
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.5,
        restitution: 0.3,
      }
    );
    cannonWorld.defaultContactMaterial = defaultContactMaterial;

    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
      mass: 0, // floor no effection from gravity
      position: new CANNON.Vec3(0, 0, 0),
      shape: floorShape,
      material: defaultMaterial,
    });
    // body 도 회전시킴
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI / 2
    );
    cannonWorld.addBody(floorBody);

    // Mesh
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: "slategray",
      })
    );

    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true; // 그림자
    sceneRef.current.add(floorMesh);

    let spheres = [];
    const sphereGeometry = new THREE.SphereGeometry(0.5); // 반지름 0.5
    const sphereMeterial = new THREE.MeshStandardMaterial({
      color: "seagreen",
    });

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
      // 60 frame/s 의 경우 0.016 출력
      const delta = clock.getDelta();

      // 화면 주사율에 따라서 분기
      let cannonStepTime = 1 / 60;
      if (delta < 0.01) cannonStepTime = 1 / 120;
      cannonWorld.step(cannonStepTime, delta, 3);

      // 캐논 바디 따라가게 하기
      spheres.forEach((item) => {
        item.mesh.position.copy(item.cannonBody.position);
        item.mesh.quaternion.copy(item.cannonBody.quaternion);
      });

      renderer.render(sceneRef.current, camera);
      renderer.setAnimationLoop(draw);
    }

    function setSize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(sceneRef.current, camera);
    }

    const sound = new Audio(mySound);

    function collide(e) {
      const velocity = e.contact.getImpactVelocityAlongNormal();
      if (velocity > 2) {
        sound.currentTime = 0;
        sound.play();
      }
    }

    // 이벤트
    window.addEventListener("resize", setSize);
    rendererRef.current.addEventListener("click", () => {
      const mySphere = new MySphere({
        scene: sceneRef.current,
        cannonWorld: cannonWorld,
        geometry: sphereGeometry,
        material: sphereMeterial,
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * 5 + 2,
        z: (Math.random() - 0.5) * 2,
        scale: Math.random() + 0.2,
      });
      spheres.push(mySphere);

      mySphere.cannonBody.addEventListener("collide", collide);

      console.log("spheres", spheres);
      console.log("sceneRef.current", sceneRef.current);
    });

    const preventDragClick = new PreventDragClick(rendererRef.current);

    // 삭제하기
    const btn = document.createElement("button");
    btn.style.cssText =
      "position: absolute; left: 20px; top: 500px; font-size: 20px";
    btn.innerHTML = "삭제";
    document.body.append(btn);

    btn.addEventListener("click", () => {
      spheres.forEach((item) => {
        item.cannonBody.removeEventListener("collide", collide);
        cannonWorld.removeBody(item.cannonBody);
        sceneRef.current.remove(item.mesh);
      });
      spheres = [];
    });

    draw();

    return () => {
      btn.remove();
    };
  }, []);

  return <div ref={rendererRef}></div>;
}
