import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

import { useEffect, useRef, useState } from "react";

import { PreventDragClick } from "../utils/PreventDragClick";
import { Domino } from "../utils/Domino";
import mySound from "../sounds/boing.mp3";

// ----- 주제: Domino
// 도미노

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

export default function ObjectRemove() {
  const rendererRef = useRef(null); // 랜더러 참조
  const sceneRef = useRef(null); // 신 참조

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

    // Loader
    const gltfLoader = new GLTFLoader();

    // Cannon (물리 엔진)
    const cannonWorld = new CANNON.World();
    cannonWorld.gravity.set(0, -10, 0);

    // 성능을 위한 세팅
    // cannonWorld.allowSleep = true; // body 가 엄청 느려지면 각 객체들 테스트 안함
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
        friction: 0.01,
        restitution: 0.9,
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
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({
        color: "slategray",
      })
    );

    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true; // 그림자
    sceneRef.current.add(floorMesh);

    // 도미노 생성
    const dominos = [];
    let domino;
    for (let i = 0; i < 20; i++) {
      domino = new Domino({
        index: i,
        scene: scene,
        cannonWorld: cannonWorld,
        gltfLoader: gltfLoader,
        // y: 2,
        z: -i * 0.8,
      });
      dominos.push(domino);
    }

    // 그리기
    const clock = new THREE.Clock();

    function draw() {
      // 60 frame/s 의 경우 0.016 출력
      const delta = clock.getDelta();

      // 화면 주사율에 따라서 분기
      let cannonStepTime = 1 / 60;
      if (delta < 0.01) cannonStepTime = 1 / 120;
      cannonWorld.step(cannonStepTime, delta, 3);

      dominos.forEach((item) => {
        if (item.cannonBody) {
          item.modelMesh.position.copy(item.cannonBody.position);
          item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
        }
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

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function checkIntersects() {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(sceneRef.current.children);
      console.log("intersects", intersects);
      intersects.map((item) => {
        console.log(item.object.name);
        return true;
      });

      // 힘을 가함
      for (const item of intersects) {
        if (item.object.cannonBody) {
          item.object.cannonBody.applyForce(
            new CANNON.Vec3(0, 0, -100),
            new CANNON.Vec3(0, 0, 0)
          );
          break;
        }
      }

      // if (intersects.length > 0) {
      //   if (intersects[0].object.cannonBody) {
      //     intersects[0].object.cannonBody.applyForce(
      //       new CANNON.Vec3(0, 0, -100),
      //       new CANNON.Vec3(0, 0, 0)
      //     );
      //   }
      // }
    }

    // 이벤트
    window.addEventListener("resize", setSize);
    rendererRef.current.addEventListener("click", (e) => {
      if (preventDragClick.mouseMoved) return;
      // console.log(rendererRef.current);
      mouse.x = (e.clientX / rendererRef.current.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY / rendererRef.current.clientHeight) * 2 - 1);
      // console.log(mouse.x);
      // console.log(mouse.y);
      checkIntersects();
    });

    const preventDragClick = new PreventDragClick(rendererRef.current);

    draw();
  }, []);

  return <div ref={rendererRef}></div>;
}
