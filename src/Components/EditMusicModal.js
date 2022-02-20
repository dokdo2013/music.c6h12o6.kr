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
import { GrConfigure } from 'react-icons/gr';

function EditMusicModal({isOpen, onOpen, onClose, data}) {
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

  useEffect(() => {
    loadMusicAPI(data.editTarget);
  }, [data.editTarget, isOpen ])

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

  const loadMusicAPI = idx => {
    axios.get(data.apiBaseURL + '/music/' + idx)
    .then(Response => {
      if (Response.data.code === 'SUCCESS') {
        const res = Response.data.data;
        setItem(res);
        setCategory(res.category_idx);
        setCategoryName(res.category_name);
        setCategoryColor(res.category_color);
        setMusicName(res.music_name);
        setAuthorName(res.author_name);
        setAlbumCover(res.album_cover);
        setComment(res.music_comment);
      }
    })
  }

  const saveAPI = async () => {
    setMusicName(musicName.trim());
    setAuthorName(authorName.trim());
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
      result = await axios.put(
        data.apiBaseURL + '/music/' + data.editTarget,
        dt, {
          headers: {
            'X-Access-Token': localStorage.getItem('X-Access-Token')
          }
        }
      )
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: 'error',
        isClosable: true,
        duration: 10000
      });  
      return false;
    } finally {
      data.setLoadFromModal(Math.random(0,10000));
      if (result.status === 200) {
        toast({
          title: '곡을 성공적으로 수정했습니다.',
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
    onClose();
    resetItem();
  }

  const resetItem = () => {
    setCategory(1);
    setCategoryName('');
    setCategoryColor('');
    setMusicName('');
    setAuthorName('');
    setComment('');
    setAlbumCover('https://dummyimage.com/500x500');
  }

  return (
    <>
      <Modal closeOnOverlayClick={false} onClose={close} isOpen={isOpen} isCentered={false} colorScheme="puprle" scrollBehavior='inside' size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>노래 수정</ModalHeader>
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
                    <Select id="category" value={category || ''} onChange={e => {
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
                  <Input id='music_name' value={musicName || ''} placeholder="곡명 예시" type='text' onChange={e => {
                      setMusicName(e.target.value);
                    }} />
                  <FormHelperText>한글 10자 / 영문 15자 이내 권장 (영역 초과시 ... 표시)</FormHelperText>
                </FormControl>
                <FormControl mb="3">
                  <FormLabel htmlFor='author_name'>가수명 *</FormLabel>
                  <Input id='author_name' value={authorName || ''} placeholder="가수명 예시" type='text' onChange={e => {
                      setAuthorName(e.target.value);
                    }} />
                  <FormHelperText>등록되지 않은 가수 입력시 자동등록</FormHelperText>
                </FormControl>
                <FormControl mb="3">
                  <FormLabel htmlFor='album_cover'>앨범 이미지 url *</FormLabel>
                  <Input id='album_cover' value={albumCover || ''} placeholder="앨범 이미지 예시" type='text' onChange={e => {
                      setAlbumCover(e.target.value);
                    }} />
                  <FormHelperText>정사각형 권장 (정사각형 비율 아니면 잘리는 부분 발생)</FormHelperText>
                </FormControl>
                <FormControl mb="3">
                  <FormLabel htmlFor='comment'>추가 설명</FormLabel>
                  <Input id='comment' value={comment || ''} type='text' onChange={e => {
                      setComment(e.target.value);
                    }} />
                  <FormHelperText>간략하게 작성 (20자 이내 권장)</FormHelperText>
                </FormControl>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='gray' mr="1" onClick={onClose}>닫기</Button>
            <Button colorScheme='purple' onClick={saveItem}>수정</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditMusicModal;