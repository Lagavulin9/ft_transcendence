import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import tokyoDart from "react95/dist/themes/tokyoDark";
import original from "react95/dist/themes/original";
import { Layout, Grid, Row, Col } from "antd";
// UI components
import {
  MenuList,
  MenuListItem,
  Separator,
  styleReset,
  AppBar,
  Frame,
  Bar,
  Button,
  Toolbar,
} from "react95";
import Appbar from "./Appbar";
import Link from "next/link";
import FriendIcon from "../friendList/FriendIcon";
import ChatIcon from "../chat/ChatIcon";
import GameIcon from "../game/GameIcon";
import RandomMatch from "../game/RandomMatch";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import store, { AppDispatch, RootState } from "@/redux/RootStore";
import { fetchProfile } from "@/redux/Slice/Profile";
import Image from "next/image";
import { useLoginMutation, useSignupMutation } from "@/redux/Api/Auth";
import { SignIn } from "@/utils/SignIn";

const { useBreakpoint } = Grid;
type Props = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  const screens = useBreakpoint();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { uId, isLoading } = useSelector(
    (state: RootState) => state.rootReducers.global
  );
  const [isLogin, setIsLogin] = useState(false);

  const openProfile = async () => {
    document.body.style.overflow = "hidden";
    if (uId) {
      router.push({ pathname: "/Page/Profile", query: { uId } }, undefined, {
        shallow: false,
      });
    }
    setIsOpen(!isOpen);
  };

  const login = async () => {
    setIsLogin(true);
    await SignIn();
  };

  return (
    <div
      style={{
        backgroundColor: "#008080",
        marginLeft: -8,
        marginRight: -3,
        marginTop: -8,
        marginBottom: -10,
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <ThemeProvider theme={original}>
          <div style={{ height: "100%" }}>
            <div style={{ top: "0px", height: "3rem" }}>
              <Bar
                style={{
                  width: "100vw",
                  height: screens.md ? "100%" : "100%",
                  paddingTop: "3px",
                }}
              >
                <Toolbar style={{ justifyContent: "space-between" }}>
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <Button
                      onClick={() => setOpen(!open)}
                      active={open}
                      style={{
                        fontWeight: "bold",
                        fontFamily: "dunggeunmo-bold",
                        height: screens.md ? "2rem" : "40px",
                        width: screens.md ? "6rem" : "90px",
                        fontSize: screens.md ? "1.2rem" : "19px",
                        marginBottom: "20px",
                      }}
                    >
                      <img
                        src="https://user-images.githubusercontent.com/86397600/236210202-560b7128-fa5a-4fdd-b746-f3c304c977bd.png"
                        style={{
                          paddingRight: "5px",
                          height: screens.md ? "1.6rem" : "25px",
                        }}
                      />
                      Start
                    </Button>
                    {open && (
                      <MenuList
                        style={{
                          position: "absolute",
                          left: "0%",
                          top: "45%",
                          width: "30vw",
                          zIndex: 100,
                        }}
                        onClick={() => setOpen(false)}
                      >
                        <MenuListItem onClick={openProfile}>
                          <span role="img" aria-label="👨‍💻">
                            👨‍💻
                          </span>
                          <div style={{ fontFamily: "dunggeunmo-bold" }}>
                            Profile?
                          </div>
                        </MenuListItem>
                        <MenuListItem
                          onClick={() =>
                            (window.location.href =
                              "https://github.com/Lagavulin9/ft_transcendence")
                          }
                        >
                          <span role="img" aria-label="📁">
                            📁
                          </span>
                          <div
                            style={{
                              fontFamily: "dunggeunmo-bold",
                            }}
                          >
                            GitHub?
                          </div>
                        </MenuListItem>
                        <Separator />
                        <MenuListItem onClick={login}>
                          <span role="img" aria-label="🔙">
                            🔙
                          </span>
                          <div style={{ fontFamily: "dunggeunmo-bold" }}>
                            Login?
                          </div>
                        </MenuListItem>
                      </MenuList>
                    )}
                  </div>
                </Toolbar>
              </Bar>
            </div>
            <Row gutter={[0, 30]}>
              {!isLoading &&
                Components.map(({ Component }, index) => {
                  return <Component key={index} />;
                })}
            </Row>
            {children}
          </div>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default AppLayout;

interface Component {
  Component: React.FunctionComponent;
}

const Components: Component[] = [
  {
    Component: () => {
      return (
        <Col xs={12} sm={8} md={4}>
          <FriendIcon />
        </Col>
      );
    },
  },
  {
    Component: () => {
      return (
        <Col xs={12} sm={8} md={4}>
          <ChatIcon />
        </Col>
      );
    },
  },
  {
    Component: () => {
      return (
        <Col xs={12} sm={8} md={4}>
          <RandomMatch />
        </Col>
      );
    },
  },
];
