import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Collapse,
  Checkbox,
  Stack,
  Divider,
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
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart, FiCopy, FiInfo } from 'react-icons/fi';
import { RiFileCopy2Fill } from 'react-icons/ri';
import { FaUserLock } from 'react-icons/fa';

function CategoryModal({isOpen, onOpen, onClose, data}) {
  const { isOpen: collapseIsOpen, onToggle: collapseOnToggle } = useDisclosure()
  const [editStat, setEditStat] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [editName, setEditName] = useState('');
  const [editData, setEditData] = useState({});
  const [newData, setNewData] = useState({});
  const colorSchemes = [
    'whiteAlpha', 'blackAlpha', 'gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink', 'linkedin', 'facebook', 'messenger', 'whatsapp', 'twitter', 'telegram'
  ];

  const toast = useToast();
  const changeSuccess = () => {
    toast({
      title: '변경사항이 저장되었습니다.',
      status: 'success',
      isClosable: true,
    })
  }
  let count = 1;

  useEffect(() => {
    if (tabIndex !== 2) {
      setEditStat(true);
    }
  }, [tabIndex])

  const saveEdit = async () => {
    // 검증
    if (editData.name.trim() === '' || editData.description.trim() === '' || editData.color_scheme === 'unselected') {
      toast({
        title: '모든 칸을 입력해주세요.',
        status: 'error',
        isClosable: true,
      });
      return false; 
    }
    const dt = {
      'name': editData.name,
      'description': editData.description,
      'color_scheme': editData.color_scheme
    };

    let result = {};
    try {
      result = await axios.put(
        data.apiBaseURL + '/category/' + editData.idx,
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
      if (result.status === 200) {
        data.setLoadFromModal(Math.random(0,10000));
        toast({
          title: '카테고리를 성공적으로 수정했습니다.',
          status: 'success',
          isClosable: true,
        });  
        setTabIndex(0);
      } else {
        toast({
          title: result.data.message,
          status: 'error',
          isClosable: true,
        });  
      }
    }
  }

  const saveAdd = async () => {
    // 검증
    if (newData.name.trim() === '' || newData.description.trim() === '' || newData.color_scheme === 'unselected') {
      toast({
        title: '모든 칸을 입력해주세요.',
        status: 'error',
        isClosable: true,
      });
      return false; 
    }
    const dt = {
      'name': newData.name,
      'description': newData.description,
      'color_scheme': newData.color_scheme
    };

    let result = {};
    try {
      result = await axios.post(
        data.apiBaseURL + '/category',
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
      if (result.status === 201) {
        data.setLoadFromModal(Math.random(0,10000));
        toast({
          title: '카테고리를 성공적으로 추가했습니다.',
          status: 'success',
          isClosable: true,
        });  
        setTabIndex(0);
      } else {
        toast({
          title: result.data.message,
          status: 'error',
          isClosable: true,
        });  
      }
    }
  }

  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(0);
  const deleteOnClose = () => setDeleteIsOpen(false);
  const deleteCancelRef = useRef();

  const deleteCategory = idx => {
    axios.delete(data.apiBaseURL + '/category/' + idx, {
      headers: {
        'X-Access-Token': localStorage.getItem('X-Access-Token')
      }
    })
    .then(Response => {
      if (Response.data.code === 'SUCCESS') {
        toast({
          title: '카테고리를 삭제했습니다.',
          status: 'success',
          isClosable: true
        });
      }
      data.setLoadFromModal(Math.random(0,10000));
    })
    .catch(error => {
      toast({
        title: error.response.data.message,
        status: 'error',
        isClosable: true
      });
    })
    .finally(() => {
      deleteOnClose();
    })
  
  }

  return (
    <>
      <AlertDialog
        isOpen={deleteIsOpen}
        leastDestructiveRef={deleteCancelRef}
        onClose={deleteOnClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              카테고리 삭제
            </AlertDialogHeader>

            <AlertDialogBody>
              정말 삭제하시겠습니까? 삭제한 카테고리는 복구할 수 없습니다.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={deleteCancelRef} onClick={deleteOnClose}>
                취소
              </Button>
              <Button colorScheme='red' onClick={() => {deleteCategory(deleteTarget);}} ml={3}>
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal closeOnOverlayClick={false} onClose={onClose} isOpen={isOpen} isCentered={false} colorScheme="puprle" scrollBehavior='inside' size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>카테고리 관리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)} size='sm' variant='enclosed'>
              <TabList>
                <Tab>리스트</Tab>
                <Tab>추가</Tab>
                <Tab isDisabled={editStat}>수정</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Table size="sm" variant='simple'>
                    <Thead>
                      <Tr>
                        <Th textAlign="center">No.</Th>
                        <Th textAlign="center">카테고리명</Th>
                        <Th textAlign="center">테마색상</Th>
                        <Th textAlign="center">생성일자</Th>
                        <Th textAlign="center">작업</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {
                        data.categoryItems.map(item => {
                          return (
                            <Tr key={item.idx}>
                              <Td>{count++}</Td>
                              <Td>{item.name}</Td>
                              <Td><Badge colorScheme={item.color_scheme}>{item.color_scheme}</Badge></Td>
                              <Td>{item.reg_datetime}</Td>
                              <Td style={{display: 'flex'}}>
                                <Button size="xs" mr="1" onClick={() => {setTabIndex(2); setEditName(item.name); setEditData(item);}}>수정</Button>
                                <Button size="xs" colorScheme="red" onClick={() => {setDeleteTarget(item.idx); setDeleteIsOpen(true)}}>삭제</Button>
                              </Td>
                            </Tr>
                          )
                        })
                      }
                    </Tbody>
                  </Table>
                </TabPanel>
                <TabPanel>
                  <Flex flexDirection="column">
                    <FormControl mb="3">
                      <FormLabel htmlFor='new_category_name'>카테고리명 *</FormLabel>
                      <Input id='new_category_name' placeholder="카테고리명을 입력해주세요" type='text' value={newData.name || ''} onChange={e => {
                          let newData2 = {...newData};
                          newData2.name = e.target.value;
                          setNewData({
                            ...newData2
                          });
                        }} />
                    </FormControl>
                    <FormControl mb="3">
                      <FormLabel htmlFor='new_description'>카테고리 설명 *</FormLabel>
                      <Input id='new_description' placeholder="설명을 입력해주세요" type='text' value={newData.description || ''} onChange={e => {
                          let newData2 = {...newData};
                          newData2.description = e.target.value;
                          setNewData({
                            ...newData2
                          });
                        }} />
                    </FormControl>
                    <FormControl mb="3">
                      <FormLabel htmlFor='color_scheme'>테마 색상 *</FormLabel>
                      <Flex>
                        <Select id="color_scheme" onChange={e => {
                          const index = e.target[e.target.selectedIndex];
                          let newData2 = {...newData};
                          newData2.color_scheme = index.value;
                          setNewData({
                            ...newData2
                          });
                        }} value={newData.color_scheme || 'unselected'}>
                        <option value="unselected">선택</option>
                        {
                          colorSchemes.map(item => {
                            return (
                              <option value={item} key={item}>{item}</option>
                            )
                          })
                        }
                        </Select>
                        <Button ml="1" onClick={collapseOnToggle}>색상 보기</Button>
                      </Flex>
                    </FormControl>

                  </Flex>

                  <Collapse in={collapseIsOpen} animateOpacity>
                    <Flex flexWrap="wrap">
                      {
                        colorSchemes.map(item => {
                          return (
                            <Badge m="0.5" key={item} colorScheme={item}>{item}</Badge>
                          );
                        })
                      }
                    </Flex>
                  </Collapse>

                  <Divider my="2" />

                  <Flex flexWrap="nowrap">
                    <Button mx="0.5" isFullWidth onClick={() => {setTabIndex(0);}}>취소</Button>
                    <Button mx="0.5" colorScheme="purple" isFullWidth onClick={() => {saveAdd();}}>추가</Button>
                  </Flex>

                </TabPanel>
                <TabPanel>
                  <Alert status='info'>
                    <AlertIcon />
                    현재 '{editName}' 카테고리를 수정 중입니다.
                  </Alert>

                  <Divider my="2" />

                  <Flex flexDirection="column">
                    <FormControl mb="3">
                      <FormLabel htmlFor='category_name'>카테고리명 *</FormLabel>
                      <Input id='category_name' placeholder="카테고리명을 입력해주세요" type='text' value={editData.name || ''} onChange={e => {
                          let newData = {...editData};
                          newData.name = e.target.value;
                          setEditData({
                            ...newData
                          });
                        }} />
                    </FormControl>
                    <FormControl mb="3">
                      <FormLabel htmlFor='description'>카테고리 설명 *</FormLabel>
                      <Input id='description' placeholder="설명을 입력해주세요" type='text' value={editData.description || ''} onChange={e => {
                          let newData = {...editData};
                          newData.description = e.target.value;
                          setEditData({
                            ...newData
                          });
                        }} />
                    </FormControl>
                    <FormControl mb="3">
                      <FormLabel htmlFor='color_scheme'>테마 색상 *</FormLabel>
                      <Flex>
                        <Select id="color_scheme" onChange={e => {
                          const index = e.target[e.target.selectedIndex];
                          let newData = {...editData};
                          newData.color_scheme = index.value;
                          setEditData({
                            ...newData
                          });
                        }} value={editData.color_scheme || ''}>
                        <option value="unselected">선택</option>
                        {
                          colorSchemes.map(item => {
                            return (
                              <option value={item} key={item}>{item}</option>
                            )
                          })
                        }
                        </Select>
                        <Button ml="1" onClick={collapseOnToggle}>색상 보기</Button>
                      </Flex>
                    </FormControl>

                  </Flex>

                  <Collapse in={collapseIsOpen} animateOpacity>
                    <Flex flexWrap="wrap">
                      {
                        colorSchemes.map(item => {
                          return (
                            <Badge m="0.5" key={item} colorScheme={item}>{item}</Badge>
                          );
                        })
                      }
                    </Flex>
                  </Collapse>

                  <Divider my="2" />

                  <Flex flexWrap="nowrap">
                    <Button mx="0.5" isFullWidth onClick={() => {setTabIndex(0);}}>취소</Button>
                    <Button mx="0.5" colorScheme="purple" isFullWidth onClick={() => {saveEdit();}}>수정</Button>
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
  )
}

export default CategoryModal;