import React from "react";
import { Menu, Avatar, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";

import "../styles/components/fixedNavbar.css";

function FixedHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const goToUserInfo = () => {
    const userId = Cookies.get("userId");
    if (userId) {
      navigate(`/user/info?userId=${userId}`);
    }
  };

  const handleLogout = () => {
    axios
      .post("http://172.26.21.193:8080/user/logout", { timeout: 5000 })
      .then(() => {
        Cookies.remove("userId"); // 쿠키에서 userId 삭제
        // navigate("/"); // 새로고침을 해주어야 Header 컴포넌트가 다시 마운트되어 로그인 상태가 갱신됨 -> window.location.href로 변경
        window.location.href = "/"; // 로그아웃 시 랜딩 페이지로 이동
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">내 프로필</Menu.Item>
      <Menu.Item key="2" onClick={goToUserInfo}>
        내 정보 수정
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        로그아웃
      </Menu.Item>
    </Menu>
  );

  return (
      <Menu
        mode="horizontal"
        theme="light"
        className="navbar"
        selectedKeys={[location.pathname === "/" ? "/main" : location.pathname]}
        style={{
          backgroundColor: "black",
          display: "flex",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: "1",
          width: "100%",
        }}
      >
        <div key="/main">
          <Link to="/main">
            <p className="logo">Hafit</p>
          </Link>
        </div>

        {/* 데스크톱에서는 '소개'와 '공지사항'을 보여줍니다. */}
        <React.Fragment>
          <Menu.Item key="/main" className="group-menu desktop-only">
            <Link to="/main" className="nav-menu">
              운동
            </Link>
          </Menu.Item>
          <Menu.Item key="/calendar" className="group-menu desktop-only">
            <Link to="/prepare" className="nav-menu">
              운동 일정
            </Link>
          </Menu.Item>
          <Menu.Item key="/stats" className="group-menu desktop-only">
            <Link to="/prepare" className="nav-menu">
              운동 통계
            </Link>
          </Menu.Item>
          <Menu.Item key="/community/main" className="group-menu desktop-only">
            <Link to="/community/main" className="nav-menu">
              커뮤니티
            </Link>
          </Menu.Item>
        </React.Fragment>

        {/* 모바일에서는 '모바일 메뉴1'과 '모바일 메뉴2'가 소개와 공지사항을 대체합니다. */}
        {/* <React.Fragment>
        <Menu.Item key="mobile-menu-replace" className="group-menu mobile-only">
          <Link to="/main">모바일 메뉴1</Link>
        </Menu.Item>
        <Menu.Item
          key="mobile-menu2-replace"
          className="group-menu mobile-only"
        >
          <Link to="/calendar">모바일 메뉴2</Link>
        </Menu.Item>
      </React.Fragment> */}
        <Menu.Item key="/exec/rest">
          <Link to="/exec/rest">...</Link>
        </Menu.Item>
        <Menu.Item style={{ marginLeft: "auto", marginRight: "80px" }}>
          <Dropdown overlay={menu} trigger={["click"]}>
            <a
              href="/#"
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <Avatar
                size="large"
                icon={<UserOutlined style={{ fontSize: "22px" }} />}
                style={{ marginRight: "4px" }}
              />
              <DownOutlined style={{ fontSize: "14px" }} />
            </a>
          </Dropdown>
        </Menu.Item>
      </Menu>
  );
}

export default FixedHeader;