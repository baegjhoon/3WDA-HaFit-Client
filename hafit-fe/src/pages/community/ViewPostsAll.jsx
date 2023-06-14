import {
  UserOutlined,
  CommentOutlined,
  HomeOutlined,
  PlusOutlined,
  PictureOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { FiEdit3 } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { IoMdNotifications } from "react-icons/io";
import { IoCreateOutline, IoArrowBack } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {
  Layout,
  Menu,
  theme,
  Avatar,
  List,
  Badge,
  Divider,
  Button,
  Col,
  Row,
  Typography,
  message,
  Upload,
  Modal,
  Select,
  Input,
  Space,
  Carousel,
} from "antd";
import VirtualList from "rc-virtual-list";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
// import jwt_decode from "jwt-decode";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import FixedHeader from "../../components/FixedNavbar";
import "../../styles/pages/community/viewPostsAll.css";

import LikeButton from "../../components/buttons/LikeBtn";
import PostModal from "../../components/modal/PostModal";

SwiperCore.use([Navigation, Pagination]);

const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";
const ContainerHeight = 1200;

const { Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

// 파일 업로드 시, base64로 변환하는 함수
const getBase64 = (file) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
  console.log(file);
};

// 파일 업로드 시, 드래그 앤 드롭 기능을 위한 props
const props = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const ViewPostsAll = () => {
  const accessToken = useSelector((state) => state.authToken.accessToken);

  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부 상태값

  //   --------- START : 게시글 무한 스크롤 ---------- //
  const [data, setData] = useState([]);
  const appendData = useCallback(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData((prevData) => prevData.concat(body.results));
        // message.success(`${body.results.length} more items loaded!`);
      });
  }, []);

  useEffect(() => {
    appendData();
  }, [appendData]);

  const onScroll = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      appendData();
    }
  };
  //   --------- END : 게시글 무한 스크롤 ---------- //

  // --------- START : 게시글 정보 관련 ---------- //
  const [posts, setPosts] = useState([]);

  const getPosts = useCallback(() => {
    axios
      .get("/api/post", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
        // 네트워크 오류로 인해 게시글을 불러오지 못했을 때, 임시 렌더링
        setPosts([
          {
            userId: 1,
            images: [
              "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
              "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
              // "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
              "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              // "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              // "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
            ],
            content:
              "네트워크 오류로 인해 게시글을 불러오지 못했습니다. 다시 시도해주세요.",
          },
        ]);
      });
  }, [accessToken, setPosts]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  // 각 게시글 이미지 개수에 따른 렌더링 함수
  const renderImagesByPost = (post) => {
    if (!post?.images || post.images.length === 0) {
      return null;
    }
    if (post.images.length === 1) {
      return (
        <img
          className="post-image-only"
          width={272}
          alt="logo"
          src={post.images[0]}
        />
      );
    } else if (post.images.length === 2) {
      return (
        <>
          <img
            className="post-image"
            width={272}
            alt="logo"
            src={post.images[0]}
          />
          <img
            className="post-image"
            width={272}
            alt="logo"
            src={post.images[1]}
          />
        </>
      );
    } else if (post.images.length >= 3) {
      // SwiperCore.use([Navigation, Pagination]);

      return (
        <Swiper
          slidesPerView={2}
          spaceBetween={30}
          navigation={{ clickable: true }}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          {post.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img width={272} alt="slide" src={image} />
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }
  };
  // --------- END : 게시글 정보 관련 ---------- //

  // --------- START : 파일 업로드 관련 ---------- //
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-2",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const onUploadChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  // --------- END : 파일 업로드 관련 ---------- //

  // --------- START : 캐러셀 prev, next 관련 ---------- //
  const [carouselRef, setCarouselRef] = useState(null);

  const next = () => {
    carouselRef.next();
  };

  const previous = () => {
    carouselRef.prev();
  };
  // --------- END : 캐러셀 prev, next 관련 ---------- //

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const navbarScroll = () => {
      const y = window.scrollY;
      const testnavbar = document.querySelector(".testnavbar");

      if (y > 10) {
        testnavbar.classList.add("small");
      } else {
        testnavbar.classList.remove("small");
      }
    };
    window.addEventListener("scroll", navbarScroll);

    return () => {
      window.removeEventListener("scroll", navbarScroll);
    };
  }, []);

  return (
    <Layout>
      <FixedHeader />
      <Layout hasSider>
        <Sider
          width={280}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 60,
            bottom: 0,
            padding: "24px 8px",
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            // items={items}
          >
            <div
              className="user-info"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "16px 0 24px 0",
              }}
            >
              <Avatar
                className="user-avatar"
                size={64}
                shape="circle"
                icon={<UserOutlined />}
              />
              <div style={{ paddingBottom: "4px" }}>
                <div style={{ margin: "0 0 4px 16px", marginBottom: "18px" }}>
                  <span
                    style={{
                      fontSize: "18px",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    김해핏
                  </span>{" "}
                  <FiEdit3 />
                </div>
                <span style={{ margin: "0 16px" }}>example@hafit.com</span>
              </div>
            </div>
            <Divider style={{ color: "white", borderColor: "#9999996c" }} />
            <Menu.Item key="1">
              <HomeOutlined />
              HOME
            </Menu.Item>
            <Menu.Item key="2">
              <GoSearch />
              검색
            </Menu.Item>
            <Menu.Item key="3">
              <UserOutlined />
              마이페이지
            </Menu.Item>
            <Divider style={{ color: "white", borderColor: "#9999996c" }} />
            <React.Fragment>
              <List
                size="small"
                // dataSource={data}
                // renderItem={(item) => <List.Item>{item}</List.Item>}
              >
                <List.Item className="sider-sub-menu">
                  좋아요 표시한 글
                </List.Item>
                <List.Item className="sider-sub-menu">내가 작성한 글</List.Item>
                <List.Item className="sider-sub-menu">내 작성 댓글</List.Item>
              </List>
            </React.Fragment>
          </Menu>
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: 280,
          }}
        >
          <div className="testnavbar">
            <Menu
              mode="horizontal"
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: "100%",
                maxHeight: "40px",
                padding: "0 8px",
                margin: "0",
                backgroundColor: "inherit",
                borderRadius: "12px",
              }}
            >
              <div style={{ display: "flex" }}>
                <Menu.Item key="all-posts">전체글 보기</Menu.Item>
                <Menu.Item key="fotd">오운완</Menu.Item>
                <Menu.Item key="feedback">자세 피드백</Menu.Item>
                <Menu.Item key="qna">운동 Q&amp;A</Menu.Item>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  height: "100%",
                }}
              >
                <Menu.Item key="search">
                  <GoSearch style={{ fontSize: "18px" }} />
                </Menu.Item>
                <Menu.Item key="notification">
                  {/* <Badge count={99} overflowCount={10} size="small" style={{ display: "flex", padding: "0 4px", maxWidth: "28px", justifyContent: "center", }}> */}
                  <Badge dot="true">
                    <IoMdNotifications
                      style={{ fontSize: "20px", color: "#d2d2d2" }}
                    />
                  </Badge>
                </Menu.Item>
                <Menu.Item
                  key="write-post"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    className="write-post-btn"
                    onClick={() => {
                      setModalVisible(true);
                    }}
                    icon={
                      <IoCreateOutline
                        style={{
                          fontSize: "1.4em",
                          color: "white",
                          marginRight: "2px",
                        }}
                      />
                    }
                  >
                    <span className="write-post-btn-text">글쓰기</span>
                  </Button>
                  <PostModal
                    visible={modalVisible}
                    // onCancel={() => setModalVisible(false)}
                  >
                    <Row>
                      <Col className="modal-header" span={24}>
                        <Button
                          className="modal-back-btn"
                          icon={<IoArrowBack style={{ fontSize: "1.4em" }} />}
                          onClick={() => setModalVisible(false)}
                        ></Button>
                        <Title
                          level={5}
                          style={{
                            display: "flex",
                            margin: 0,
                            marginLeft: "auto",
                            marginRight: "auto",
                            paddingLeft: "40px",
                          }}
                        >
                          새 게시물 작성하기
                        </Title>
                        <Button className="post-submit-btn">
                          <span>완료</span>
                        </Button>
                      </Col>
                    </Row>
                    <Divider className="divider" />
                    <Row>
                      <Col span={13} style={{ minHeight: "480px" }}>
                        {fileList.length === 0 ? (
                          <Dragger
                            {...props}
                            multiple={true}
                            maxCount={6}
                            style={{ width: "96%" }}
                            accept=".jpg, .jpeg, .png, .gif, .mp4, .avi"
                            showUploadList={false}
                            onChange={onUploadChange}
                            beforeUpload={(file) => {
                              const isLt10Mb = file.size / 1024 / 1024 < 10;
                              if (!isLt10Mb) {
                                message.error(
                                  "파일 크기는 10MB 미만이어야 합니다."
                                );
                              }
                              return isLt10Mb;
                            }}
                          >
                            <p className="ant-upload-drag-icon">
                              <PictureOutlined />
                            </p>
                            <p className="ant-upload-text">
                              이곳에 사진을 드래그하거나 클릭해서 첨부할 수
                              있습니다 :&#41;
                            </p>
                            <p className="ant-upload-hint">
                              최대 6장까지 업로드 가능합니다! <br />
                              사진 업로드 시, 다음의 주의사항을 숙지해주세요:{" "}
                              <br />
                              <br />
                              1. 각 사진 파일 크기는 10MB 이하로 제한됩니다.
                              <br />
                              <br />
                              2. 지원되는 파일 형식은 JPG, PNG, GIF, MP4, AVI
                              입니다.
                              <br />
                              <br />
                              3. 저작권이 있는 사진은 업로드를 피해주세요.
                            </p>
                          </Dragger>
                        ) : (
                          <div className="carousel-wrapper">
                            <Button
                              className="carousel-button carousel-prev-button"
                              type="circle"
                              onClick={previous}
                              icon={
                                <LeftOutlined
                                  style={{ color: "white", fontSize: "32px" }}
                                />
                              }
                            />
                            <Carousel
                              ref={setCarouselRef}
                              slidesToShow={1} // Use slidesToShow instead of slidesPerView
                              dots // Enable pagination dots
                              infinite={true}
                              slidesToScroll={1}
                            >
                              {fileList.map((file, index) => (
                                <div key={index}>
                                  <img
                                    width={272}
                                    alt="slide"
                                    src={file.url}
                                    style={{ width: "100%", minHeight: "504px", maxHeight: "504px"  }}
                                  />
                                </div>
                              ))}
                              {/* <RightOutlined /> */}
                            </Carousel>
                            <Button
                              className="carousel-button carousel-next-button"
                              type="circle"
                              onClick={next}
                              icon={
                                <RightOutlined
                                  style={{ color: "white", fontSize: "32px" }}
                                />
                              }
                            />
                          </div>
                        )}
                      </Col>
                      <Col span={11}>
                        <Row style={{ marginLeft: "16px" }}>
                          <Col span={24} className="content-header">
                            <Space className="writer-info">
                              <Avatar
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  marginRight: "2px",
                                }}
                              />
                              <Space direction="vertical" size={0}>
                                <span
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "600",
                                  }}
                                >
                                  김해핏
                                </span>
                                <span style={{ color: "#999999" }}>
                                  2023. 04. 27
                                </span>
                              </Space>
                            </Space>
                            <Space className="select-category">
                              <Select
                                defaultValue="게시판 선택"
                                style={{
                                  width: 120,
                                }}
                                // onChange={handleChange}
                                options={[
                                  {
                                    value: "오운완",
                                    label: "오운완",
                                  },
                                  {
                                    value: "자세 피드백",
                                    label: "자세 피드백",
                                  },
                                  {
                                    value: "운동 Q&A",
                                    label: "운동 Q&A",
                                  },
                                ]}
                              />
                            </Space>
                          </Col>
                          <Col span={24} className="content-body">
                            <TextArea
                              showCount
                              maxLength={500}
                              bordered={false}
                              style={{
                                height: 160,
                                resize: "none",
                                fontSize: "16px",
                                marginBottom: "8px",
                              }}
                              placeholder="내용 입력 ..."
                            />
                            <Divider />
                          </Col>
                          <Col span={24} className="content-files">
                            <Title
                              level={5}
                              style={{
                                margin: 0,
                                marginBottom: "8px",
                              }}
                            >
                              사진/동영상
                            </Title>
                            <Upload
                              className="upload-lists"
                              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                              listType="picture-card"
                              fileList={fileList}
                              onPreview={handlePreview}
                              onChange={onUploadChange}
                              maxCount={6}
                              style={{ display: "flex", width: "100%" }}
                              accept=".jpg, .jpeg, .png, .gif, .mp4, .avi"
                              beforeUpload={(file) => {
                                const isLt10Mb = file.size / 1024 / 1024 < 10;
                                if (!isLt10Mb) {
                                  message.error(
                                    "파일 크기는 10MB 미만이어야 합니다."
                                  );
                                }
                                return isLt10Mb;
                              }}
                            >
                              {fileList.length >= 6 ? null : uploadButton}
                            </Upload>
                            <Modal
                              open={previewOpen}
                              title={previewTitle}
                              footer={null}
                              onCancel={handleCancel}
                            >
                              <img
                                alt="example"
                                style={{
                                  width: "100%",
                                }}
                                src={previewImage}
                              />
                            </Modal>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </PostModal>
                </Menu.Item>
              </div>
            </Menu>
          </div>
          {/* <div className="testoffset">
            <p>adfsasfdasfdfadssdfafsd adsfasdfasd adsfads.</p>
        </div> */}
          <Content className="testoffset">
            <div
              style={{
                padding: 24,
                textAlign: "center",
                background: "#e7e7e7",
                borderRadius: "12px",
              }}
            >
              {/* 게시글 무한 스크롤 */}
              <List>
                <VirtualList
                  data={data}
                  height={ContainerHeight}
                  itemHeight={47}
                  itemKey="email"
                  onScroll={onScroll}
                >
                  {(item) => (
                    <div
                      style={{
                        background: colorBgContainer,
                        marginBottom: "8px",
                        borderRadius: "8px",
                        padding: "8px 8px 24px 8px",
                        minHeight: "12rem",
                      }}
                    >
                      <div style={{ display: "block", margin: "0 24px" }}>
                        <div>
                          <List.Item
                            key={item.email}
                            style={{ paddingBottom: "4px" }}
                          >
                            <List.Item.Meta
                              style={{ display: "flex", textAlign: "left" }}
                              avatar={
                                <Avatar
                                  src={item.picture.large}
                                  style={{ width: "48px", height: "48px" }}
                                />
                              }
                              title={
                                <a href="https://ant.design">
                                  {item.name.last}
                                </a>
                              }
                              description="2023. 05. 18 - 20:24"
                            />
                            <HiOutlineDotsHorizontal
                              style={{
                                fontSize: "28px",
                                color: "#999999",
                                alignSelf: "self-start",
                              }}
                            />
                          </List.Item>
                        </div>
                        <Divider style={{ margin: "0 0 16px 0" }} />
                        <p className="post-content-p">
                          <span className="post-content-text">
                            동해물과 백두산이 마르고 닳도록 하느님이 보우하사
                            우리 나라 만세
                          </span>
                        </p>
                        <p className="post-content-p">
                          <span className="post-content-text">
                            #무궁화 #삼천리 #화려강산 #대한사람 #대한으로 #길이
                            #보전하세
                          </span>
                        </p>

                        {/* 게시글 이미지 렌더링 */}
                        {/* <div>
                          {posts.map((post, index) => (
                            <article key={index} className="image-container">
                              {renderImagesByPost(post)}
                            </article>
                          ))}
                        </div> */}
                        <div>
                          {Array.from(posts).map((post, index) => (
                            <article key={index} className="image-container">
                              {renderImagesByPost(post)}
                            </article>
                          ))}
                        </div>

                        {/* 아래 주석 처리된 코드는 테스트 용도 */}
                        {/* <article
                          className="image-container"
                          style={{
                            height: "100%",
                            maxHeight: "24rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "4px auto",
                          }}
                        >
                          <Swiper
                            slidesPerView={2}
                            spaceBetween={30}
                            navigation={true}
                            pagination={{
                              clickable: true,
                            }}
                            modules={[Navigation, Pagination]}
                            className="mySwiper"
                          >
                            <SwiperSlide>
                              <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                              />
                            </SwiperSlide>
                            <SwiperSlide>
                              <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                              />
                            </SwiperSlide>
                            <SwiperSlide>
                              <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                              />
                            </SwiperSlide>
                          </Swiper>
                          <img
                            className="post-image"
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                          />
                          <img
                            className="post-image"
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                          /> 
                        </article> */}
                        <div
                          style={{
                            display: "flex",
                            textAlign: "left",
                            marginTop: "12px",
                          }}
                        >
                          {/* <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginRight: "8px",
                            }}
                          >
                            <HiOutlineHeart
                              style={{
                                fontSize: "2.1em",
                                marginRight: "4px",
                                color: "#999999",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "16px",
                                color: "#999999",
                                marginRight: "40px",
                              }}
                            >
                              10
                            </span>
                          </div> */}
                          <div style={{ marginRight: "16px" }}>
                            <LikeButton />
                          </div>

                          <Button
                            shape="round"
                            style={{
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "4px 12px",
                            }}
                            icon={
                              <CommentOutlined
                                style={{
                                  fontSize: "1.8em",
                                  color: "#999999",
                                }}
                              />
                            }
                          >
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#999999",
                              }}
                            >
                              2
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </VirtualList>
              </List>
            </div>
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ViewPostsAll;
