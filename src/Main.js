import React, { ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import {
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Badge,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  CircularProgress,
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
import { ReactText } from 'react';
import Music from './Components/Music';
import InfiniteScroll from 'react-infinite-scroller';
// import { calcRelativeAxisPosition } from 'framer-motion/types/projection/geometry/delta-calc';
import axios from 'axios';
// import useIntersectionObserver from './useIntersectionObserver';

// const apiBaseURL = "https://api.c6h12o6.kr";
const apiBaseURL = "http://localhost:9090";

const page_calculator = (width, height) => {
  if (width >= 768) {
    width = width - 240;
  }
  const per_width = parseInt(width / 155);
  const per_height = parseInt(height / 205) + 1;
  const per_page = per_width * per_height * 3;
  localStorage.setItem('per_page', per_page);
  return per_page;
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function SimpleSidebar({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  // contents list
  // const currentPage = useRef(0);
  const [musicItems, setMusicItems] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    console.log(windowDimensions);
    page_calculator(windowDimensions.width, windowDimensions.height);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('now_page', 1);
    loadAPI2(1);
  }, [])

  function loadAPI(per_page = 40, page = 1) {
    axios
      .get(apiBaseURL + "/music?per_page=" + per_page + "&page=" + page)
      .then((Response)=>{
        if (Response.data.code === 'SUCCESS') {
          // console.log(Response.data.data.data);
          setMusicItems(Response.data.data.data);
        }
      })
    // console.log(dt);
  }

  const loadAPI2 = useCallback(async ({ page = 1 }) => {
      try {
        let data;
        await axios
        .get(apiBaseURL + "/music?per_page=" + localStorage.getItem('per_page') + "&page=" + page)
        .then((Response)=>{
          if (Response.data.code === 'SUCCESS') {
            // console.log(Response.data.data.data);
            setMusicItems(Response.data.data.data);
            data = Response.data.data.data;
            // console.log(Response.data.data.rows);
            // console.log(parseInt(Response.data.data.rows / localStorage.getItem('per_page') + 1));
            // setTotalPage(parseInt(Response.data.data.rows / localStorage.getItem('per_page') + 1))
            }
        })
        console.log(typeof(data));
        return data;
      } catch(e) {
        // setError(e);
      } finally {
        // setLoading(false);
      }
  }, []);

  const loadMoreAPI = async () => {
    if(musicItems.length > 0 && !updating) {
      // currentPage.current++;
      setUpdating(true);
      localStorage.setItem('now_page', parseInt(localStorage.getItem('now_page')) + 1)
      const data = await loadAPI2({
        // query: currentQuery.current,
        page: localStorage.getItem('now_page')
        // page: 
      });
      if (typeof(data) !== 'object') {
        setHasMore(false);
        return false;
      }
      console.log('more');
      console.log([...musicItems, ...data]);
      setMusicItems([...musicItems, ...data]);
      setUpdating(false);
    }
  };

  // useIntersectionObserver({
  //   root: rootRef.current,
  //   target: targetRef.current,
  //   onIntersect: ([{isIntersecting}]) => {
  //     // loadMoreAPI();
  //     console.log(currentPage.current + ' / ' + totalPage);
  //     if(
  //       isIntersecting &&
  //       !loading &&
  //       currentPage.current < totalPage
  //     ) {
  //       loadMoreAPI();
  //     }
  //   }
  // });

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
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
          <InfiniteScroll
              pageStart={0}
              loadMore={loadMoreAPI}
              hasMore={hasMore}
              loader={<div className="loader" key={0}>Loading ...</div>}
          >
          <Flex justifyContent="center" flexDirection="row" flexWrap="wrap">
            {
              musicItems.map(item => {
                return <Music apiData={item} key={item.idx}></Music>;
              })
            }
              {/* {items} // <-- This is the content you want to load */}
          </Flex>
          </InfiniteScroll>
        {/* <CircularProgress isIndeterminate color='green.300' display={loading ? 'block' : 'none'} /> */}
      </Box>
    </Box>
  );
}

// interface SidebarProps extends BoxProps {
//   onClose: () => void;
// }

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
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
          <Input placeholder='Search' />
        </InputGroup>
      </Flex>

      {/* <Flex h="20" mx="8" mt="4">
        <Text fontSize={12} mb='8px'>카테고리</Text>
      </Flex> */}
      <Flex h="20" mx="8" mt="4">
        <Text fontSize={14} textAlign="center" fontFamily="IBM Plex Sans KR" mb='8px'>검색 기능 추가 예정입니다</Text>
      </Flex>




      {/* {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))} */}
    </Box>
  );
};

// interface NavItemProps extends FlexProps {
//   icon: IconType;
//   children: ReactText;
// }
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

// interface MobileProps extends FlexProps {
//   onOpen: () => void;
// }
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

      {/* <Text fontSize="2xl" ml="8" fontFamily="PT Sans" fontWeight="bold">
        Music
      </Text> */}

      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiSearch />}
      />
    </Flex>
  );
};