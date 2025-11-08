import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import CustomModelLoad from "./components/CustomModelLoad";
import CustomModelAnimation from "./components/CustomModelAnimation";
import PhysicsEngineWorld from "./components/PhysicsEngineWorld";
import ContactMaterial from "./components/ContactMaterial";
import Force from "./components/Force";
import RandomPositionBallCreate from "./components/RandomPositionBallCreate";
import CollisionSound from "./components/CollisionSound";
import ObjectRemove from "./components/ObjectRemove";
import Domino from "./components/Domino";
import BasicGeometryParticle from "./components/BasicGeometryParticle";
import RandomParticle from "./components/RandomParticle";
import ParticleImage from "./components/ParticleImage";
import VariousColorParticle from "./components/VariousColorParticle";
import PointCoordinatesMesh from "./components/PointCoordinatesMesh";
import FormatChangingImagePanel from "./components/FormatChangingImagePanel";
import ScrollPage from "./components/ScrollPage";
import SteppingStoneGame from "./components/SteppingStoneGame";

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname == "/" && (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Three.js Lab
            </h1>
            <p className="text-gray-600 mb-8">
              Three.js 학습 예제 모음
            </p>

            <div className="space-y-3">
              <a
                href="/CustomModelLoad"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  커스텀 모델 로드
                </h3>
                <p className="text-sm text-gray-500">Custom Model Load</p>
              </a>

              <a
                href="/CustomModelAnimation"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  커스텀 모델 애니메이션
                </h3>
                <p className="text-sm text-gray-500">Custom Model Animation</p>
              </a>

              <a
                href="/PhysicsEngineWorld"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  물리엔진 월드
                </h3>
                <p className="text-sm text-gray-500">Physics Engine World</p>
              </a>

              <a
                href="/ContactMaterial"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  재질별 마찰력과 반발력
                </h3>
                <p className="text-sm text-gray-500">Contact Material</p>
              </a>

              <a
                href="/Force"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">힘</h3>
                <p className="text-sm text-gray-500">Force - 화면을 클릭해보세요</p>
              </a>

              <a
                href="/RandomPositionBallCreate"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  랜덤 위치 공 생성
                </h3>
                <p className="text-sm text-gray-500">
                  Random Ball - 화면을 클릭해보세요
                </p>
              </a>

              <a
                href="/CollisionSound"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">충돌 사운드</h3>
                <p className="text-sm text-gray-500">Collision Sound</p>
              </a>

              <a
                href="/ObjectRemove"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  오브젝트 제거
                </h3>
                <p className="text-sm text-gray-500">
                  Object Remove - 클릭 & 삭제버튼
                </p>
              </a>

              <a
                href="/Domino"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">도미노</h3>
                <p className="text-sm text-gray-500">Domino</p>
              </a>

              <a
                href="/BasicGeometryParticle"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  기본 지오메트리 파티클
                </h3>
                <p className="text-sm text-gray-500">Basic Geometry Particle</p>
              </a>

              <a
                href="/RandomParticle"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">랜덤 파티클</h3>
                <p className="text-sm text-gray-500">Random Particle</p>
              </a>

              <a
                href="/ParticleImage"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  파티클 이미지
                </h3>
                <p className="text-sm text-gray-500">Particle Image</p>
              </a>

              <a
                href="/VariousColorParticle"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  여러가지 색의 파티클
                </h3>
                <p className="text-sm text-gray-500">Various Color Particle</p>
              </a>

              <a
                href="/PointCoordinatesMesh"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  포인트 좌표에 메쉬 생성
                </h3>
                <p className="text-sm text-gray-500">Point Coordinates Mesh</p>
              </a>

              <a
                href="/FormatChangingImagePanel"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  형태가 바뀌는 이미지 패널
                </h3>
                <p className="text-sm text-gray-500">
                  Format Changing Image Panel
                </p>
              </a>

              <a
                href="/ScrollPage"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  스크롤 페이지
                </h3>
                <p className="text-sm text-gray-500">Scroll Page</p>
              </a>

              <a
                href="/SteppingStoneGame"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  징검다리 건너기 게임
                </h3>
                <p className="text-sm text-gray-500">Stepping Stone Game</p>
              </a>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/CustomModelLoad" element={<CustomModelLoad />}></Route>
        <Route
          path="/CustomModelAnimation"
          element={<CustomModelAnimation />}
        ></Route>
        <Route
          path="/PhysicsEngineWorld"
          element={<PhysicsEngineWorld />}
        ></Route>
        <Route path="/ContactMaterial" element={<ContactMaterial />}></Route>
        <Route path="/Force" element={<Force />}></Route>
        <Route
          path="/RandomPositionBallCreate"
          element={<RandomPositionBallCreate />}
        ></Route>
        <Route path="/CollisionSound" element={<CollisionSound />}></Route>
        <Route path="/ObjectRemove" element={<ObjectRemove />}></Route>
        <Route path="/Domino" element={<Domino />}></Route>
        <Route
          path="/BasicGeometryParticle"
          element={<BasicGeometryParticle />}
        ></Route>
        <Route path="/RandomParticle" element={<RandomParticle />}></Route>
        <Route path="/ParticleImage" element={<ParticleImage />}></Route>
        <Route
          path="/VariousColorParticle"
          element={<VariousColorParticle />}
        ></Route>
        <Route
          path="/PointCoordinatesMesh"
          element={<PointCoordinatesMesh />}
        ></Route>
        <Route
          path="/FormatChangingImagePanel"
          element={<FormatChangingImagePanel />}
        ></Route>
        <Route path="/ScrollPage" element={<ScrollPage />}></Route>
        <Route
          path="/SteppingStoneGame"
          element={<SteppingStoneGame />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
