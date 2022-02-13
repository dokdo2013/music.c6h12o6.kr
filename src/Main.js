import React, { ReactNode, useState, useEffect } from 'react';
import {
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Badge,
  CloseButton,
  CircularProgress,
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
  BoxProps,
  FlexProps,
  ButtonGroup,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiSearch
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { BiSortDown, BiSortUp } from 'react-icons/bi'; 
import { ReactText } from 'react';
import Music from './Components/Music';
// import { calcRelativeAxisPosition } from 'framer-motion/types/projection/geometry/delta-calc';
import axios from 'axios';

// const apiBaseURL = "http://localhost:9090";
const apiBaseURL = "https://api.c6h12o6.kr";

export default function SimpleSidebar({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [musicItems, setMusicItems] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [authorItems, setAuthorItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [order, setOrder] = useState('m.name');
  const [orderType, setOrderType] = useState('asc');
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [categoryStr, setCategoryStr] = useState('');
  const [searchedItemNum, setSearchedItemNum] = useState(0);

  useEffect(() => {
    loadAPI();
  }, [order, orderType, keyword, categoryStr])

  useEffect(() => {
    loadCategory();
  }, [])

  function loadAPI() {
    setLoading(true);
    axios
      .get(apiBaseURL + "/music?per_page=2000&order=" + order + "&order_type=" + orderType + "&search_keyword=" + keyword + "&search_category=" + categoryStr)
      .then((Response)=>{
        if (Response.data.code === 'SUCCESS') {
          // console.log(Response.data.data.data);
          setMusicItems(Response.data.data.data);
          setTotalItem(Response.data.data.rows);
          setSearchedItemNum(Response.data.data.data.length);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    // console.log(dt);
  }

  function loadCategory() {
    axios
      .get(apiBaseURL + "/category")
      .then((Response) => {
        if (Response.data.code === 'SUCCESS') {
          setCategoryItems(Response.data.data.data);
        }
      });
  }

  // useEffect
  const changeOrder = fromOrder => {
    if (fromOrder === order) {
      if (orderType === 'asc') {
        setOrderType('desc');
      } else {
        setOrderType('asc');
      }
    } else {
      setOrder(fromOrder);
    }
  }


  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        data={{categoryItems, keyword, setKeyword, selectedCategory, setSelectedCategory, categoryStr, setCategoryStr}}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Flex justifyContent="space-between" mb="4" alignItems="center">
          <Text fontSize={14}>
            총 {totalItem}곡 중 {searchedItemNum}곡
          </Text>
          <Stack direction='row' spacing={0} align='center'>
            <Button colorScheme={(order === 'm.name') ? 'purple' : 'teal'} variant='ghost' size="sm" onClick={() => {changeOrder('m.name')}}>
              곡명순&nbsp;{(order === 'm.name' && orderType === 'desc') ? <BiSortUp /> : <BiSortDown />}
            </Button>
            <Button colorScheme={(order === 'a.name') ? 'purple' : 'teal'} variant='ghost' size="sm" onClick={() => {changeOrder('a.name')}}>
              가수명순&nbsp;{(order === 'a.name' && orderType === 'desc') ? <BiSortUp /> : <BiSortDown />}
            </Button>
            <Button colorScheme={(order === 'm.reg_datetime') ? 'purple' : 'teal'} variant='ghost' size="sm" onClick={() => {changeOrder('m.reg_datetime')}}>
              등록순&nbsp;{(order === 'm.reg_datetime' && orderType === 'desc') ? <BiSortUp /> : <BiSortDown />}
            </Button>
          </Stack>
        </Flex>
        <Flex justifyContent="center" flexDirection="row" flexWrap="wrap">
          {
            musicItems.map(item => {
              return <Music apiData={item} key={item.idx}></Music>;
            })
          }
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <CircularProgress isIndeterminate color='green.300' display={loading ? 'block' : 'none'} />
        </Flex>
      </Box>
    </Box>
  );
}

// interface SidebarProps extends BoxProps {
//   onClose: () => void;
// }

const SidebarContent = ({ onClose, display, data }) => {

  const isSelected = idx => {
    if (data.selectedCategory.indexOf(idx) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  const listReset = () => {
    data.setSelectedCategory([]);
    data.setCategoryStr('');
  }

  const clickCategory = idx => {
    if (data.selectedCategory.indexOf(idx) !== -1) {
      // selectedCategory에 idx가 존재 -> selectedCategory에서 삭제, categoryStr에서 삭제
      let tempData = data.selectedCategory;
      let newArray = [];
      for (let i=0;i<tempData.length;i++) {
        if (tempData[i] !== idx) {
          newArray.push(tempData[i]);
        }
      }
      data.setSelectedCategory(newArray);
      data.setCategoryStr(newArray.join(','));
    } else {
      // selectedCategory에 idx가 존재하지 않음 -> selectedCategory에 추가, categoryStr에 추가
      data.setSelectedCategory([...data.selectedCategory, idx]);
      data.setCategoryStr([...data.selectedCategory, idx].join(','));
    }
  }

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...display}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Flex alignItems="center">
          <Image src='https://static-cdn.jtvnw.net/emoticons/v2/304434784/static/light/2.0' alt='C6H12O6' marginRight={2} width={30} />
          <Text fontSize="2xl" fontFamily="PT Sans" fontWeight="bold">
            Music
          </Text>
          <Badge colorScheme='purple' ml={1}>Beta</Badge>
        </Flex>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>


      <Flex mx="8">
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<FiSearch color='gray.300' />}
          />
          <Input placeholder='Search' onChange={e => {data.setKeyword(e.target.value)}} />
        </InputGroup>
      </Flex>

      <Flex h="20" mx="8" mt="4" flexDirection="column">
        <Text fontSize={12} mb='8px' ml="0.5">카테고리 ({data.categoryItems.length})</Text>
        <Flex flexDirection="row" flexWrap="wrap">
          {
            data.categoryItems.map(item => {
              return (
                <Button key={item.idx} size="xs" m="0.5" colorScheme={(isSelected(item.idx)) ? 'purple' : 'gray'} onClick={() => {clickCategory(item.idx)}}>
                  {item.name}
                </Button>
              )
            })
          }
          <Button size="xs" m="0.5" colorScheme="blackAlpha" onClick={listReset} isDisabled={data.selectedCategory.length === 0}>초기화</Button>
        </Flex>
      </Flex>
      {/* <Flex h="20" mx="8" mt="4">
        <Text fontSize={14} textAlign="center" fontFamily="IBM Plex Sans KR" mb='8px'>검색 기능 추가 예정입니다</Text>
      </Flex> */}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="space-between"
      {...rest}>

      <Flex alignItems="center">
        <Image src='https://static-cdn.jtvnw.net/emoticons/v2/304434784/static/light/2.0' alt='C6H12O6' marginRight={2} width={30} />
        <Text fontSize="2xl" fontFamily="PT Sans" fontWeight="bold">
          Music
        </Text>
        <Badge colorScheme='purple' ml={1}>Beta</Badge>
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