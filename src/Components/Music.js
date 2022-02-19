import {
  AspectRatio,
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  Button,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { FaTrashAlt } from 'react-icons/fa';
import { FiShoppingCart, FiCopy, FiInfo } from 'react-icons/fi';
import { RiFileCopy2Fill } from 'react-icons/ri';
import {CopyToClipboard} from 'react-copy-to-clipboard';

function ProductAddToCart({apiData, data}) {
  const toast = useToast();
  let copyData = apiData.author_name + ' - ' + apiData.music_name;
  if (parseInt(data.copyType) === 1) {
    copyData = apiData.author_name + ' - ' + apiData.music_name;
  } else if (parseInt(data.copyType) === 2) {
    copyData = apiData.music_name + ' - ' + apiData.author_name;
  } else if (parseInt(data.copyType) === 3) {
    copyData = apiData.music_name + ' (' + apiData.author_name + ')';
  } else if (parseInt(data.copyType) === 4) {
    copyData = apiData.music_name;
  } else if (parseInt(data.copyType) === 5) {
    copyData = '!공지/' + apiData.music_name;
  }

  if (!data.preview) {
    data.preview = false;
  }

  return (
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        w="10%"
        minW="150"
        maxW="200"
        // maxW="160"
        borderWidth="1px"
        // rounded="sm"
        shadow="sm"
        m="1"
        >
        {/* {data.isNew && (
          <Circle
            size="10px"
            position="absolute"
            top={2}
            right={2}
            bg="red.200"
          />
        )} */}

        <div>
          <AspectRatio ratio={1 / 1}>
            <Image
              src={apiData.album_cover}
              alt={`Picture of ${apiData.music_name}`}
              loading="lazy"
              fit="contain"
              // roundedTop="lg"
            />
          </AspectRatio>
        </div>

        <Box p="1">
          {/* <Box d="flex" alignItems="baseline">
            {data.isNew && (
              <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                New
              </Badge>
            )}
          </Box> */}
          <Flex mt="1" justifyContent="space-between" alignContent="center">
            <Box
              fontSize="14"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated>
                <Flex alignItems="center">
                  <Badge colorScheme={apiData.category_color} size="10" fontSize="10" mr="1">{apiData.category_name}</Badge>
                  {
                    (apiData.music_comment === null || apiData.music_comment === '') ? '' : (
                      <span>
                        <Tooltip hasArrow label={apiData.music_comment} bg='gray.300' color='black' key={apiData.idx}>
                          <span>
                            <FiInfo size={10} style={{color: 'grey', marginRight: '2px', cursor: 'pointer'}} />
                          </span>
                        </Tooltip>
                      </span>
                    )
                  }
                </Flex>
                {
                  (parseInt(data.mnameClickEvent) === 1)
                    ? (
                        <span style={{cursor: 'pointer'}} onClick={ () => {
                          toast({
                            title: apiData.music_name,
                            status: 'info',
                            isClosable: true,
                          })  
                        } }>{apiData.music_name}</span>
                      )
                    : (
                        <CopyToClipboard text={apiData.music_name}
                        onCopy={() => toast({
                          title: '클립보드에 복사했습니다!',
                          status: 'success',
                          isClosable: true,
                        })}>
                        <span style={{cursor: 'pointer'}}>{apiData.music_name}</span></CopyToClipboard>
                      )
                }
            </Box>
            {
              (parseInt(data.useCopy) === 1) && (
                  <CopyToClipboard text={copyData}
                  onCopy={() => toast({
                    title: '클립보드에 복사했습니다!',
                    status: 'success',
                    isClosable: true,
                  })}>
                  <RiFileCopy2Fill style={{color: 'lightGrey', minWidth: '20px', cursor: 'pointer'}} size={20} />
                </CopyToClipboard>    
                )
            }
          </Flex>

          <Flex justifyContent="space-between" alignContent="center" >
            <Box fontSize="12" color={useColorModeValue('gray.800', 'white')} isTruncated>
                {apiData.author_name}
            </Box>
          </Flex>

          {
            data.isLogin && (
              <Flex justifyContent="space-between" alignContent="center" mt="2">
                <Button size="xs" colorScheme="gray" mr="0.5" onClick={data.EditMusicModalOnOpen} isFullWidth>수정</Button>
                <Button size="xs" colorScheme="red" ml="0.5"><FaTrashAlt /></Button>
              </Flex>  
            )
          }
        </Box>
      </Box>
  );
}

export default ProductAddToCart;