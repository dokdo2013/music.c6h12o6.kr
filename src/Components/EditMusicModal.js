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
  useDisclosure
} from '@chakra-ui/react';
import {useState} from 'react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart, FiCopy, FiInfo } from 'react-icons/fi';
import { RiFileCopy2Fill } from 'react-icons/ri';
import { FaUserLock } from 'react-icons/fa';

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

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered={false} colorScheme="puprle" scrollBehavior='inside' size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>노래 수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>현재 준비 중입니다</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditMusicModal;