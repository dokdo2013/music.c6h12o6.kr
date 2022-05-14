import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  Image,
  Badge,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";

// const apiBaseURL = "http://localhost:9090";
const apiBaseURL = "https://api.c6h12o6.kr";

export default function SimpleCard() {
  const toast = useToast();

  const user_id = useRef();
  const user_pw = useRef();
  const auth_forever = useRef();
  const remember_id = useRef();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("remember_id") !== "" &&
      localStorage.getItem("remember_id") !== undefined &&
      localStorage.getItem("remember_id") !== null
    ) {
      user_id.current.value = localStorage.getItem("remember_id");
      setIsChecked(true);
    }
  }, []);

  const formSubmit = (e) => {
    e.preventDefault();

    // 기본 form validating
    if (user_id.current.value === "" || user_pw.current.value === "") {
      toast({
        title: "아이디 또는 비밀번호를 입력해주세요.",
        status: "error",
        isClosable: true,
        duration: null,
      });
      return false;
    }

    // 아이디 저장여부 - 저장시 저장
    if (remember_id.current.checked) {
      localStorage.setItem("remember_id", user_id.current.value);
    } else {
      localStorage.setItem("remember_id", "");
    }

    // 로그인
    const data = {
      user_id: user_id.current.value,
      user_pw: user_pw.current.value,
      auth_forever: auth_forever.current.checked,
    };
    axios
      .post(apiBaseURL + "/auth", data)
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          localStorage.setItem(
            "X-Access-Token",
            Response.data.data["X-Access-Token"]
          );
          document.location.href = "/";
        } else {
          toast({
            title: Response.data.message,
            status: "error",
            isClosable: true,
            duration: null,
          });
        }
      })
      .catch((err) => {
        toast({
          title: err.response.data.message,
          status: "error",
          isClosable: true,
          duration: null,
        });
      });
  };

  return (
    <Flex
      minH={"80vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>
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
              <Badge fontSize="md" ml={1}>
                Admin
              </Badge>
            </Flex>
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={formSubmit}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>아이디</FormLabel>
                <Input ref={user_id} id="user_id" type="text" />
              </FormControl>
              <FormControl id="password">
                <FormLabel>비밀번호</FormLabel>
                <Input ref={user_pw} id="user_pw" type="password" />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox
                    ref={remember_id}
                    size="sm"
                    isChecked={isChecked}
                    onChange={(e) => {
                      setIsChecked(e.target.checked);
                    }}
                  >
                    아이디 저장
                  </Checkbox>
                  <Checkbox
                    ref={auth_forever}
                    size="sm"
                    onChange={(e) => {
                      if (e.target.checked) {
                        toast({
                          title:
                            "'로그인 상태 유지' 설정은 공용 PC가 아닌 개인 PC에서만 사용해주세요",
                          status: "warning",
                          isClosable: true,
                        });
                      }
                    }}
                  >
                    로그인 상태 유지
                  </Checkbox>
                </Stack>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  로그인
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
