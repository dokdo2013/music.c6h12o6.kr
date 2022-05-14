import React, { ReactNode, useState, useEffect } from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Badge,
  Spinner,
  CloseButton,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Stack,
  Button,
  Text,
  useDisclosure,
  useColorMode,
  BoxProps,
  FlexProps,
  ButtonGroup,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiUser,
  FiSearch,
  FiLogOut,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { BiSortDown, BiSortUp, BiRefresh, BiCategory } from "react-icons/bi";
import { BsTwitch, BsBarChartLine, BsPlusCircleFill } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { GrSoundcloud } from "react-icons/gr";
import { FaUsersCog } from "react-icons/fa";
import { IoMdMicrophone } from "react-icons/io";
import { ReactText, useRef, memo } from "react";
import Music from "./Components/Music";
import SettingModal from "./Components/SettingModal";
import UserModal from "./Components/UserModal";
import AddMusicModal from "./Components/AddMusicModal";
import AuthorModal from "./Components/AuthorModal";
import CategoryModal from "./Components/CategoryModal";
import EditMusicModal from "./Components/EditMusicModal";
import StatModal from "./Components/StatModal";
import UserManageModal from "./Components/UserManageModal";
// import { calcRelativeAxisPosition } from 'framer-motion/types/projection/geometry/delta-calc';
import axios from "axios";

const apiBaseURL = "http://localhost:9090";
// const apiBaseURL = "http://172.30.1.2:9090";
// const apiBaseURL = "https://api.c6h12o6.kr";

export default function SimpleSidebar({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [musicItems, setMusicItems] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [order, setOrder] = useState("m.name");
  const [orderType, setOrderType] = useState("asc");
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [categoryStr, setCategoryStr] = useState("");
  const [searchedItemNum, setSearchedItemNum] = useState(0);
  const [useCopy, setUseCopy] = useState(1);
  const [copyType, setCopyType] = useState(1);
  const [mnameClickEvent, setMnameClickEvent] = useState(1);
  const [user, setUser] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const [loadFromModal, setLoadFromModal] = useState(0);
  const [loadedItemNum, setLoadedItemNum] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [onOrderChange, setOnOrderChange] = useState(false);

  const userBg = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  const toast = useToast();

  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(0);
  const [editTarget, setEditTarget] = useState(0);
  const deleteOnClose = () => setDeleteIsOpen(false);
  const deleteCancelRef = useRef();

  useEffect(() => {
    setPage(1);
    setSearchedItemNum(0);
    setLoadedItemNum(0);

    loadAPI();
    loadCategory();
  }, [order, orderType, keyword, categoryStr, loadFromModal]);

  useEffect(() => {
    changeCategoryOrder();
  }, [categoryItems]);

  // useEffect(() => {
  // }, [selectedCategory]);

  useEffect(() => {
    loadCategory();
    loadLocalStorage();
    firstAuth();
  }, []);

  function changeCategoryOrder() {
    if (!onOrderChange) {
      return false;
    }
    let targetItems = [];
    let count = 0;
    categoryItems.map((item) => {
      targetItems.push({
        category_idx: item.idx,
        order: ++count,
      });
      return true;
    });

    axios
      .put(apiBaseURL + "/category/order", { items: targetItems })
      .then(() => {
        setOnOrderChange(false);
        toast({
          title: "카테고리 순서가 변경되었습니다.",
          status: "success",
          isClosable: true,
        });
      });
  }

  function paginationAdd() {
    setLoading(true);
    axios
      .get(
        apiBaseURL +
          "/music?order=" +
          order +
          "&order_type=" +
          orderType +
          "&search_keyword=" +
          keyword +
          "&search_category=" +
          categoryStr +
          "&page=" +
          (parseInt(page) + 1) +
          "&per_page=" +
          perPage
      )
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          console.log(Response.data.data.data);
          setMusicItems([...musicItems, ...Response.data.data.data]);
          setLoadedItemNum(loadedItemNum + Response.data.data.data.length);
          setPage(parseInt(page) + 1);
        } else if (Response.data.code === "DATA_EMPTY") {
          setMusicItems([]);
          setSearchedItemNum(0);
        }
      })
      .catch(() => {
        setMusicItems([]);
        setTotalItem(0);
        setSearchedItemNum(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function loadAPI() {
    setLoading(true);
    axios
      .get(
        apiBaseURL +
          "/music?order=" +
          order +
          "&order_type=" +
          orderType +
          "&search_keyword=" +
          keyword +
          "&search_category=" +
          categoryStr +
          "&page=" +
          1 +
          "&per_page=" +
          perPage
      )
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          setMusicItems(Response.data.data.data);
          setTotalItem(Response.data.data.rows);
          setLoadedItemNum(Response.data.data.data.length);
          setSearchedItemNum(Response.data.data.searched_rows);
        } else if (Response.data.code === "DATA_EMPTY") {
          setMusicItems([]);
          setSearchedItemNum(0);
        }
      })
      .catch(() => {
        setMusicItems([]);
        setTotalItem(0);
        setSearchedItemNum(0);
      })
      .finally(() => {
        setLoading(false);
      });
    // console.log(dt);
  }

  function loadCategory() {
    axios.get(apiBaseURL + "/category").then((Response) => {
      if (Response.data.code === "SUCCESS") {
        setCategoryItems(Response.data.data.data);
      }
    });
  }

  function loadLocalStorage() {
    if (
      localStorage.getItem("order") !== null &&
      localStorage.getItem("order") !== ""
    ) {
      setOrder(localStorage.getItem("order"));
    }
    if (
      localStorage.getItem("order_type") !== null &&
      localStorage.getItem("order_type") !== ""
    ) {
      setOrderType(localStorage.getItem("order_type"));
    }
    if (
      localStorage.getItem("setting_use_copy") !== null &&
      localStorage.getItem("setting_use_copy") !== ""
    ) {
      setUseCopy(localStorage.getItem("setting_use_copy"));
    }
    if (
      localStorage.getItem("setting_copy_type") !== null &&
      localStorage.getItem("setting_copy_type") !== ""
    ) {
      setCopyType(localStorage.getItem("setting_copy_type"));
    }
    if (
      localStorage.getItem("setting_mname_click_event") !== null &&
      localStorage.getItem("setting_mname_click_event") !== ""
    ) {
      setMnameClickEvent(localStorage.getItem("setting_mname_click_event"));
    }
  }
  // useEffect
  const changeOrder = (fromOrder) => {
    if (fromOrder === order) {
      if (orderType === "asc") {
        setOrderType("desc");
        localStorage.setItem("order_type", "desc");
      } else {
        setOrderType("asc");
        localStorage.setItem("order_type", "asc");
      }
    } else {
      setOrder(fromOrder);
      localStorage.setItem("order", fromOrder);
    }
  };

  const firstAuth = () => {
    // 토큰 존재 여부 체크
    if (
      localStorage.getItem("X-Access-Token") === "" ||
      localStorage.getItem("X-Access-Token") === undefined ||
      localStorage.getItem("X-Access-Token") === null
    ) {
      localStorage.setItem("X-Access-Token", "");
      return false;
    }

    // 토큰 유효성 체크
    axios
      .post(
        apiBaseURL + "/auth/validate",
        {},
        {
          headers: {
            "X-Access-Token": localStorage.getItem("X-Access-Token"),
          },
        }
      )
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          setIsLogin(true);
          setUser(Response.data.data);
        }
      })
      .catch((error) => {
        localStorage.setItem("X-Access-Token", "");
        toast({
          title: (
            <>
              로그인 정보가 만료되었습니다. 다시{" "}
              <Link color="blue.400" href="/login">
                로그인
              </Link>
              해주세요.
            </>
          ),
          status: "error",
          duration: null,
          isClosable: true,
        });
      });
  };

  const deleteMusic = (idx) => {
    axios
      .delete(apiBaseURL + "/music/" + idx, {
        headers: {
          "X-Access-Token": localStorage.getItem("X-Access-Token"),
        },
      })
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          toast({
            title: "노래를 삭제했습니다.",
            status: "success",
            isClosable: true,
          });
        }
        setLoadFromModal(Math.random(0, 10000));
      })
      .catch((error) => {
        toast({
          title: error.response.data.message,
          status: "error",
          isClosable: true,
        });
      })
      .finally(() => {
        deleteOnClose();
      });
  };
  const {
    isOpen: modalIsOpen,
    onOpen: modalOnOpen,
    onClose: modalOnClose,
  } = useDisclosure();
  const {
    isOpen: UserModalIsOpen,
    onOpen: UserModalOnOpen,
    onClose: UserModalOnClose,
  } = useDisclosure();
  const {
    isOpen: AddMusicModalIsOpen,
    onOpen: AddMusicModalOnOpen,
    onClose: AddMusicModalOnClose,
  } = useDisclosure();
  const {
    isOpen: AuthorModalIsOpen,
    onOpen: AuthorModalOnOpen,
    onClose: AuthorModalOnClose,
  } = useDisclosure();
  const {
    isOpen: CategoryModalIsOpen,
    onOpen: CategoryModalOnOpen,
    onClose: CategoryModalOnClose,
  } = useDisclosure();
  const {
    isOpen: EditMusicModalIsOpen,
    onOpen: EditMusicModalOnOpen,
    onClose: EditMusicModalOnClose,
  } = useDisclosure();
  const {
    isOpen: StatModalIsOpen,
    onOpen: StatModalOnOpen,
    onClose: StatModalOnClose,
  } = useDisclosure();
  const {
    isOpen: UserManageModalIsOpen,
    onOpen: UserManageModalOnOpen,
    onClose: UserManageModalOnClose,
  } = useDisclosure();

  return (
    <Box id="main" minH="100%" bg={useColorModeValue("gray.100", "gray.900")}>
      <SettingModal
        isOpen={modalIsOpen}
        onOpen={modalOnOpen}
        onClose={modalOnClose}
        data={{
          apiBaseURL,
          loadFromModal,
          setLoadFromModal,
          useCopy,
          setUseCopy,
          copyType,
          setCopyType,
          mnameClickEvent,
          setMnameClickEvent,
        }}
      />
      <UserModal
        isOpen={UserModalIsOpen}
        onOpen={UserModalOnOpen}
        onClose={UserModalOnClose}
        data={{
          apiBaseURL,
          loadFromModal,
          setLoadFromModal,
          useCopy,
          setUseCopy,
          copyType,
          setCopyType,
          mnameClickEvent,
          setMnameClickEvent,
        }}
      />
      <AddMusicModal
        isOpen={AddMusicModalIsOpen}
        onOpen={AddMusicModalOnOpen}
        onClose={AddMusicModalOnClose}
        data={{ apiBaseURL, loadFromModal, setLoadFromModal, categoryItems }}
      />
      <AuthorModal
        isOpen={AuthorModalIsOpen}
        onOpen={AuthorModalOnOpen}
        onClose={AuthorModalOnClose}
        data={{
          apiBaseURL,
          loadFromModal,
          setLoadFromModal,
          useCopy,
          setUseCopy,
          copyType,
          setCopyType,
          mnameClickEvent,
          setMnameClickEvent,
        }}
      />
      <CategoryModal
        isOpen={CategoryModalIsOpen}
        onOpen={CategoryModalOnOpen}
        onClose={CategoryModalOnClose}
        data={{
          apiBaseURL,
          loadFromModal,
          categoryItems,
          setCategoryItems,
          setLoadFromModal,
          useCopy,
          setUseCopy,
          copyType,
          setCopyType,
          mnameClickEvent,
          setMnameClickEvent,
          setOnOrderChange,
        }}
      />
      <EditMusicModal
        isOpen={EditMusicModalIsOpen}
        onOpen={EditMusicModalOnOpen}
        onClose={EditMusicModalOnClose}
        data={{
          apiBaseURL,
          categoryItems,
          editTarget,
          loadFromModal,
          setLoadFromModal,
          useCopy,
          setUseCopy,
          copyType,
          setCopyType,
          mnameClickEvent,
          setMnameClickEvent,
        }}
      />
      <StatModal
        isOpen={StatModalIsOpen}
        onOpen={StatModalOnOpen}
        onClose={StatModalOnClose}
        data={{
          apiBaseURL,
          loadFromModal,
          setLoadFromModal,
          useCopy,
          setUseCopy,
          copyType,
          setCopyType,
          mnameClickEvent,
          setMnameClickEvent,
        }}
      />
      <UserManageModal
        isOpen={UserManageModalIsOpen}
        onOpen={UserManageModalOnOpen}
        onClose={UserManageModalOnClose}
        data={{
          apiBaseURL,
          loadFromModal,
          setLoadFromModal,
          useCopy,
          setUseCopy,
          copyType,
          setCopyType,
          mnameClickEvent,
          setMnameClickEvent,
        }}
      />
      <AlertDialog
        isOpen={deleteIsOpen}
        leastDestructiveRef={deleteCancelRef}
        onClose={deleteOnClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              노래 삭제
            </AlertDialogHeader>

            <AlertDialogBody>
              정말 삭제하시겠습니까? 삭제한 노래는 복구할 수 없습니다.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={deleteCancelRef} onClick={deleteOnClose}>
                취소
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteMusic(deleteTarget);
                }}
                ml={3}
              >
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <SidebarContent
        onClose={() => onClose}
        data={{
          user,
          userBg,
          isLogin,
          modalOnOpen,
          UserModalOnOpen,
          AddMusicModalOnOpen,
          AuthorModalOnOpen,
          CategoryModalOnOpen,
          EditMusicModalOnOpen,
          StatModalOnOpen,
          UserManageModalOnOpen,
          colorMode,
          toggleColorMode,
          categoryItems,
          keyword,
          setKeyword,
          selectedCategory,
          setSelectedCategory,
          categoryStr,
          setCategoryStr,
        }}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            data={{
              user,
              userBg,
              isLogin,
              modalOnOpen,
              UserModalOnOpen,
              AddMusicModalOnOpen,
              AuthorModalOnOpen,
              CategoryModalOnOpen,
              EditMusicModalOnOpen,
              StatModalOnOpen,
              UserManageModalOnOpen,
              colorMode,
              toggleColorMode,
              categoryItems,
              keyword,
              setKeyword,
              selectedCategory,
              setSelectedCategory,
              categoryStr,
              setCategoryStr,
            }}
            onClose={onClose}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Flex justifyContent="space-between" mb="4" alignItems="center">
          <Text fontSize={14} display="flex" alignItems="center">
            총 {totalItem}곡 중 {searchedItemNum}곡 ({loadedItemNum}곡 로드됨){" "}
            <BiRefresh
              style={{
                marginLeft: "2px",
                cursor: "pointer",
                minWidth: "14px",
                marginRight: "4px",
              }}
              onClick={() => {
                loadAPI();
                loadCategory();
              }}
            />
            {loading && (
              <Badge
                colorScheme="purple"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Spinner size="xs" mr={1} /> 로딩중
              </Badge>
            )}
          </Text>
          <Stack direction="row" spacing={0} align="center">
            <Button
              colorScheme={order === "m.name" ? "purple" : "teal"}
              variant="ghost"
              size="sm"
              onClick={() => {
                changeOrder("m.name");
              }}
            >
              곡명순&nbsp;
              {order === "m.name" && orderType === "desc" ? (
                <BiSortUp />
              ) : (
                <BiSortDown />
              )}
            </Button>
            <Button
              colorScheme={order === "a.name" ? "purple" : "teal"}
              variant="ghost"
              size="sm"
              onClick={() => {
                changeOrder("a.name");
              }}
            >
              가수명순&nbsp;
              {order === "a.name" && orderType === "desc" ? (
                <BiSortUp />
              ) : (
                <BiSortDown />
              )}
            </Button>
            <Button
              colorScheme={order === "m.reg_datetime" ? "purple" : "teal"}
              variant="ghost"
              size="sm"
              onClick={() => {
                changeOrder("m.reg_datetime");
              }}
            >
              등록순&nbsp;
              {order === "m.reg_datetime" && orderType === "desc" ? (
                <BiSortUp />
              ) : (
                <BiSortDown />
              )}
            </Button>
          </Stack>
        </Flex>
        <Flex justifyContent="center" flexDirection="row" flexWrap="wrap">
          <MemoMusicWrapper
            musicItems={musicItems}
            datas={{
              setEditTarget,
              setDeleteTarget,
              setDeleteIsOpen,
              EditMusicModalOnOpen,
              isLogin,
              useCopy,
              copyType,
              mnameClickEvent,
            }}
          />
          {/* {
            musicItems.map(item => {
              return <Music apiData={item} key={item.idx} data={{setEditTarget, setDeleteTarget, setDeleteIsOpen, EditMusicModalOnOpen, isLogin, useCopy, copyType, mnameClickEvent}}></Music>;
            })
          } */}
          {searchedItemNum === 0 && !loading && (
            <Text mt="6">검색 결과가 없습니다</Text>
          )}
        </Flex>
        {searchedItemNum > loadedItemNum ? (
          <Flex justifyContent="center" my={10}>
            <Button
              onClick={paginationAdd}
              colorScheme="teal"
              variant="outline"
              isLoading={loading}
            >
              +{" "}
              {searchedItemNum - loadedItemNum > perPage
                ? perPage
                : searchedItemNum - loadedItemNum}
              개 더 로드
            </Button>
          </Flex>
        ) : (
          <Box mb={5} />
        )}
        {/* <Flex justifyContent="center" alignItems="center" mt="6">
          <CircularProgress
            isIndeterminate
            color="green.300"
            display={loading ? "block" : "none"}
          />
        </Flex> */}
      </Box>
    </Box>
  );
}

const MusicWrapper = (dt) => {
  return (
    <>
      {dt.musicItems.map((item) => {
        return <Music apiData={item} key={item.idx} data={dt.datas}></Music>;
      })}
    </>
  );
};
const MemoMusicWrapper = memo(MusicWrapper);

// interface SidebarProps extends BoxProps {
//   onClose: () => void;
// }

const SidebarContent = ({ onClose, data, ...rest }) => {
  const isSelected = (idx) => {
    if (data.selectedCategory.indexOf(idx) !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const listReset = () => {
    data.setSelectedCategory([]);
    data.setCategoryStr("");
    data.setKeyword("");
  };

  const clickCategory = (idx) => {
    if (data.selectedCategory.indexOf(idx) !== -1) {
      // selectedCategory에 idx가 존재 -> selectedCategory에서 삭제, categoryStr에서 삭제
      let tempData = data.selectedCategory;
      let newArray = [];
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i] !== idx) {
          newArray.push(tempData[i]);
        }
      }
      data.setSelectedCategory(newArray);
      data.setCategoryStr(newArray.join(","));
    } else {
      // selectedCategory에 idx가 존재하지 않음 -> selectedCategory에 추가, categoryStr에 추가
      data.setSelectedCategory([...data.selectedCategory, idx]);
      data.setCategoryStr([...data.selectedCategory, idx].join(","));
    }
  };

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Flex alignItems="center">
          <Image
            src="https://static-cdn.jtvnw.net/emoticons/v2/304434784/static/light/2.0"
            alt="C6H12O6"
            marginRight={2}
            width={30}
          />
          <Text fontSize="2xl" fontFamily="PT Sans" fontWeight="bold">
            Music
          </Text>
          <Badge colorScheme="purple" ml={1}>
            Beta
          </Badge>
        </Flex>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <Flex mx="8">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<FiSearch color="gray.300" />}
          />
          <Input
            placeholder="Search"
            value={data.keyword}
            onChange={(e) => {
              data.setKeyword(e.target.value);
            }}
          />
        </InputGroup>
      </Flex>

      <Flex
        flexDirection="column"
        justifyContent="space-between"
        style={{ height: "calc(var(--vh) - 120px)" }}
      >
        {/* 검색 옵션 영역 */}
        <Flex overflow="auto" flexDirection="column">
          <Flex mx="8" mt="4" flexDirection="column">
            <Text fontSize={12} mb="8px" ml="0.5">
              카테고리 ({data.categoryItems.length})
            </Text>
            <Flex flexDirection="row" flexWrap="wrap">
              {data.categoryItems.map((item) => {
                return (
                  <Button
                    key={item.idx}
                    size="xs"
                    m="0.5"
                    colorScheme={isSelected(item.idx) ? "purple" : "gray"}
                    onClick={() => {
                      clickCategory(item.idx);
                    }}
                  >
                    {item.name} ({item.music_count})
                  </Button>
                );
              })}
              <Button
                size="xs"
                m="0.5"
                colorScheme="teal"
                onClick={listReset}
                isDisabled={
                  data.selectedCategory.length === 0 &&
                  data.keyword.length === 0
                }
              >
                초기화
              </Button>
            </Flex>
          </Flex>
        </Flex>
        {/* 설정 영역 */}
        <Flex flexDirection="column">
          <Flex mx="8" mt="4" mb="4" flexDirection="column">
            <Button
              colorScheme="purple"
              display={{ base: "flex", md: "none" }}
              variant="outline"
              onClick={onClose}
            >
              적용
            </Button>
          </Flex>

          <Flex mx="8" flexDirection="column">
            <Divider />
          </Flex>

          {data.isLogin && (
            <>
              <Flex
                p={2}
                alignItems="center"
                justifyContent="space-between"
                bg={data.userBg}
                mx="8"
                mb="4"
                flexDirection="row"
              >
                <Flex flexDir="row">
                  <Avatar
                    size="sm"
                    name={data.user.name}
                    src={data.user.profile_img}
                    mr="2"
                  />
                  <Flex flexDirection="column">
                    <Text fontSize="xx-small">관리자</Text>
                    <Text fontSize="sm" fontWeight="semibold">
                      {data.user.name}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  fontSize="xs"
                  flexDirection="column"
                  justifyContent="space-evenly"
                  h="100%"
                >
                  <FiUser
                    style={{ cursor: "pointer" }}
                    onClick={data.UserModalOnOpen}
                  />
                  <FiLogOut
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      localStorage.setItem("X-Access-Token", "");
                      document.location.reload();
                    }}
                  />
                </Flex>
              </Flex>

              <Flex mx="8" flexDirection="column">
                <Button
                  isFullWidth
                  mb="2"
                  size="sm"
                  onClick={data.AddMusicModalOnOpen}
                >
                  <BsPlusCircleFill style={{ marginRight: "8px" }} size="12" />
                  노래 추가
                </Button>
                <Button
                  isFullWidth
                  mb="2"
                  size="sm"
                  onClick={data.CategoryModalOnOpen}
                >
                  <BiCategory style={{ marginRight: "8px" }} size="12" />
                  카테고리 관리
                </Button>
                <Button
                  isFullWidth
                  mb="2"
                  size="sm"
                  onClick={data.AuthorModalOnOpen}
                >
                  <IoMdMicrophone style={{ marginRight: "8px" }} size="12" />
                  가수 관리
                </Button>
                <Button
                  isFullWidth
                  mb="2"
                  size="sm"
                  onClick={data.UserManageModalOnOpen}
                >
                  <FaUsersCog style={{ marginRight: "8px" }} size="12" />
                  회원 관리
                </Button>
                <Button isFullWidth size="sm" onClick={data.StatModalOnOpen}>
                  <BsBarChartLine style={{ marginRight: "8px" }} size="12" />
                  통계
                </Button>
              </Flex>
            </>
          )}

          <Flex justifyContent="center" mt="4" mb="4">
            <IconButton
              variant="outline"
              size="sm"
              aria-label="Twitch"
              onClick={() => {
                window.open("https://twitch.tv/kimc6h12o6");
              }}
              icon={<BsTwitch />}
              mr="1"
            />

            <IconButton
              variant="outline"
              size="sm"
              aria-label="Soundcloud"
              onClick={() => {
                window.open("https://soundcloud.com/aqttrx5eh3ey");
              }}
              icon={<GrSoundcloud />}
              mr="1"
            />

            <IconButton
              variant="outline"
              size="sm"
              aria-label="Color Mode"
              onClick={data.toggleColorMode}
              icon={data.colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              mr="1"
            />

            <IconButton
              variant="outline"
              size="sm"
              aria-label="Color Mode"
              onClick={data.modalOnOpen}
              icon={<FiSettings />}
            />

            {/* <Button size="sm" onClick={data.toggleColorMode} variant="outline">
              {data.colorMode === 'light' ? '다크' : '라이트'}모드 설정&nbsp;{data.colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button> */}
          </Flex>
        </Flex>
      </Flex>

      {/* <Flex h="20" mx="8" mt="4">
        <Text fontSize={14} textAlign="center" fontFamily="IBM Plex Sans KR" mb='8px'>검색 기능 추가 예정입니다</Text>
      </Flex> */}
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="space-between"
      {...rest}
    >
      <Flex alignItems="center">
        <Image
          src="https://static-cdn.jtvnw.net/emoticons/v2/304434784/static/light/2.0"
          alt="C6H12O6"
          marginRight={2}
          width={30}
        />
        <Text fontSize="2xl" fontFamily="PT Sans" fontWeight="bold">
          Music
        </Text>
        <Badge colorScheme="purple" ml={1}>
          Beta
        </Badge>
      </Flex>

      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiSearch />}
      />
    </Flex>
  );
};
