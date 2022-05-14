import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Checkbox,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  FormControl,
  FormLabel,
  Link,
  Switch,
  Select,
  FormErrorMessage,
  FormHelperText,
  Flex,
  Circle,
  Box,
  Input,
  InputRightElement,
  InputGroup,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { FiShoppingCart, FiCopy, FiInfo } from "react-icons/fi";
import { RiFileCopy2Fill } from "react-icons/ri";
import { FaUserLock } from "react-icons/fa";

function UserModal({ isOpen, onOpen, onClose, data }) {
  const [nowShow, setNowShow] = useState(false);
  const nowHandleClick = () => setNowShow(!nowShow);

  const [newShow, setNewShow] = useState(false);
  const newHandleClick = () => setNewShow(!newShow);

  const [nowPassword, setNowPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const toast = useToast();
  const changeSuccess = () => {
    toast({
      title: "변경사항이 저장되었습니다.",
      status: "success",
      isClosable: true,
    });
  };

  const changePassword = async () => {
    if (nowPassword.trim().length === 0 || newPassword.trim().length === 0) {
      toast({
        title: "모든 칸을 입력해주세요.",
        status: "error",
        isClosable: true,
      });
      return false;
    }

    const dt = {
      now_password: nowPassword.trim(),
      new_password: newPassword.trim(),
    };

    let result = {};
    try {
      result = await axios.put(data.apiBaseURL + "/user/password", dt, {
        headers: {
          "X-Access-Token": localStorage.getItem("X-Access-Token"),
        },
      });
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        isClosable: true,
        duration: 10000,
      });
      return false;
    } finally {
      if (result.status === 200) {
        toast({
          title: "비밀번호 변경에 성공했습니다.",
          status: "success",
          isClosable: true,
        });
        onClose();
        setNowPassword("");
        setNewPassword("");
      } else {
        toast({
          title: result.data.message,
          status: "error",
          isClosable: true,
        });
        return false;
      }
    }
  };

  return (
    <>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered={false}
        colorScheme="puprle"
        scrollBehavior="inside"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>개인정보 수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs size="sm" variant="enclosed">
              <TabList>
                <Tab>비밀번호 변경</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Flex flexDirection="column">
                    <FormControl mb="3">
                      <FormLabel htmlFor="nowPassword">
                        현재 비밀번호 *
                      </FormLabel>
                      <InputGroup size="md">
                        <Input
                          pr="4.5rem"
                          id="nowPassword"
                          type={nowShow ? "text" : "password"}
                          placeholder="현재 비밀번호를 입력해주세요"
                          value={nowPassword}
                          onChange={(e) => {
                            setNowPassword(e.target.value);
                          }}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={nowHandleClick}
                          >
                            {nowShow ? "가리기" : "보이기"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      {/* <FormHelperText>등록되지 않은 가수 입력시 자동등록</FormHelperText> */}
                    </FormControl>

                    <FormControl mb="3">
                      <FormLabel htmlFor="newPassword">
                        새로운 비밀번호 *
                      </FormLabel>
                      <InputGroup size="md">
                        <Input
                          pr="4.5rem"
                          id="newPassword"
                          type={newShow ? "text" : "password"}
                          placeholder="새로운 비밀번호를 입력해주세요"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                          }}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={newHandleClick}
                          >
                            {newShow ? "가리기" : "보이기"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormHelperText>
                        비밀번호 규칙 : 영어, 숫자를 포함해 8자 이상 (대소문자
                        구분)
                      </FormHelperText>
                    </FormControl>

                    <Button
                      colorScheme="purple"
                      isFullWidth
                      onClick={changePassword}
                    >
                      변경
                    </Button>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UserModal;
