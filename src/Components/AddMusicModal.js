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
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Icon,
  chakra,
  Tooltip,
  useToast,
  useDisclosure
} from '@chakra-ui/react';
import {useState, useEffect, useRef} from 'react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart, FiCopy, FiInfo } from 'react-icons/fi';
import { RiFileCopy2Fill } from 'react-icons/ri';
import { FaUserLock } from 'react-icons/fa';
import Music from './Music';
import axios from 'axios';

function AddMusicModal({isOpen, onOpen, onClose, data}) {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  const toast = useToast();
  const changeSuccess = () => {
    toast({
      title: '변경사항이 저장되었습니다.',
      status: 'success',
      isClosable: true,
    })
  }
  const isPreview = true;
  const useCopy = false;
  const isLogin = false;
  const copyType = 1;
  const mnameClickEvent = 1;
  const [item, setItem] = useState({});
  
  const catRef = useRef();
  const [category, setCategory] = useState(1);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('');
  const [musicName, setMusicName] = useState('곡명 예시');
  const [authorName, setAuthorName] = useState('가수명 예시');
  const [comment, setComment] = useState('');
  const [albumCover, setAlbumCover] = useState('https://dummyimage.com/500x500');

  useEffect(() => {
    const item2 = {
      "music_name": musicName,
      "album_cover": albumCover,
      "music_comment": comment,
      "author_name": authorName,
      "category_name": categoryName,
      "category_color": categoryColor
    }
    setItem(item2);
  }, [category, categoryName, categoryColor, albumCover, musicName, authorName, comment]);

  useEffect(() => {
    firstCategory();
  }, [])

  const firstCategory = () => {
    if (data.categoryItems.length > 0) {
      const catItem = data.categoryItems[0];
      setCategory(catItem.idx);
      setCategoryName(catItem.name);
      setCategoryColor(catItem.color_scheme);
    }
  }

  const saveItem = async () => {
    if (await saveAPI()) {
      close();
    }
  }

  const saveItemGo = () => {
    saveAPI();
  }

  const saveAPI = async () => {
    if(musicName === '' || musicName === '곡명 예시' || authorName === '가수명 예시' || authorName === '') {
      toast({
        title: '모든 칸을 입력해주세요.',
        status: 'error',
        isClosable: true,
      });
      return false;  
    }

    const dt = {
      'name': musicName,
      'author_name': authorName,
      'category_idx': category,
      'album_cover': albumCover,
      'comment': comment
    };

    let result = {};
    try {
      result = await axios.post(
        data.apiBaseURL + '/music',
        dt, {
          headers: {
            'X-Access-Token': localStorage.getItem('X-Access-Token')
          }
        }
      )
    } catch (error) {
      console.log(error);
    } finally {
      data.setLoadFromModal(Math.random(0,10000));
      if (result.status === 201) {
        toast({
          title: '곡을 성공적으로 추가했습니다.',
          status: 'success',
          isClosable: true,
        });  
        return true;
      } else {
        toast({
          title: result.data.message,
          status: 'error',
          isClosable: true,
        });  
        return false;
      }
    }


  }

  const close = () => {
    resetItem();
    onClose();
  }

  const resetItem = () => {
    setCategory(1);
    setCategoryName('K-POP');
    setCategoryColor('purple');
    setMusicName('곡명 예시');
    setAuthorName('가수명 예시');
    setComment('');
    setAlbumCover('https://dummyimage.com/500x500');
  }

  return (
    <>
      <Modal closeOnOverlayClick={false} onClose={close} isOpen={isOpen} isCentered={false} colorScheme="puprle" scrollBehavior='inside' size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>노래 추가</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="row" justifyContent="space-between">
              <Flex flexDirection="column">
                <Text ml="1" fontSize="sm">미리보기</Text>
                <Flex justifyContent="flex-start">
                  <Music apiData={item} data={{isPreview, useCopy, isLogin, mnameClickEvent, copyType }}></Music>
                </Flex>
              </Flex>
              <Flex flexDirection="column">
                <FormControl mb="3">
                  <FormLabel htmlFor='category'>카테고리 *</FormLabel>
                    <Select ref={catRef} id="category" onChange={e => {
                      const index = e.target[e.target.selectedIndex];
                      setCategory(e.target.value);
                      setCategoryName(index.label);
                      setCategoryColor(index.id);
                    }}>
                      {
                        data.categoryItems.map(catItem => {
                          return (
                            <option value={catItem.idx} key={catItem.idx} id={catItem.color_scheme} label={catItem.name}>{catItem.name}</option>
                          )
                        })
                      }
                    </Select>
                  {/* <FormHelperText>한글 10자 / 영문 15자 이내 권장 (영역 초과시 ... 표시)</FormHelperText> */}
                </FormControl>
                <FormControl mb="3">
                  <FormLabel htmlFor='music_name'>곡명 *</FormLabel>
                  <Input id='music_name' placeholder="곡명 예시" type='text' onChange={e => {
                      setMusicName(e.target.value);
                    }} />
                    {/* <List>
                      <ListItem>ddd</ListItem>
                      <ListItem>ddd</ListItem>
                      <ListItem>ddd</ListItem>
                      <ListItem>ddd</ListItem>
                      <ListItem>ddd</ListItem>
                      <ListItem>ddd</ListItem>
                      <ListItem>ddd</ListItem>
                      <ListItem>ddd</ListItem>
                    </List> */}
                  <FormHelperText>한글 10자 / 영문 15자 이내 권장 (영역 초과시 ... 표시)</FormHelperText>
                </FormControl>
                <FormControl mb="3">
                  <FormLabel htmlFor='author_name'>가수명 *</FormLabel>
                  <Input id='author_name' placeholder="가수명 예시" type='text' onChange={e => {
                      setAuthorName(e.target.value);
                    }} />
                  <FormHelperText>등록되지 않은 가수 입력시 자동등록</FormHelperText>
                </FormControl>
                <FormControl mb="3">
                  <FormLabel htmlFor='album_cover'>앨범 이미지 url *</FormLabel>
                  <Input id='album_cover' placeholder="앨범 이미지 예시" type='text' onChange={e => {
                      setAlbumCover(e.target.value);
                    }} />
                  <FormHelperText>정사각형 권장 (정사각형 비율 아니면 잘리는 부분 발생)</FormHelperText>
                </FormControl>
                <FormControl mb="3">
                  <FormLabel htmlFor='comment'>추가 설명</FormLabel>
                  <Input id='comment' type='text' onChange={e => {
                      setComment(e.target.value);
                    }} />
                  <FormHelperText>간략하게 작성 (20자 이내 권장)</FormHelperText>
                </FormControl>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='gray' mr="1" onClick={onClose}>닫기</Button>
            <Button colorScheme='gray' mr="1" onClick={saveItemGo}>추가하고 계속</Button>
            <Button colorScheme='purple' onClick={saveItem}>추가</Button>
            {/* <Button onClick={onClose} ml="1">취소</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddMusicModal;