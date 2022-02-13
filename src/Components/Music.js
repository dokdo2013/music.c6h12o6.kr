import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart, FiCopy, FiInfo } from 'react-icons/fi';
import { RiFileCopy2Fill } from 'react-icons/ri';
import {CopyToClipboard} from 'react-copy-to-clipboard';

function ProductAddToCart({apiData}) {
  const toast = useToast();

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
          <Image
            src={apiData.album_cover}
            alt={`Picture of ${apiData.music_name}`}
            loading="lazy"
            fit="contain"
            // roundedTop="lg"
          />
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
                            <FiInfo size={10} style={{color: 'grey', marginRight: '2px'}} />
                          </span>
                        </Tooltip>
                      </span>
                    )
                  }
                </Flex>
                  {apiData.music_name}
            </Box>
            <CopyToClipboard text={apiData.author_name + ' - ' + apiData.music_name}
              onCopy={() => toast({
                title: '클립보드에 복사했습니다!',
                status: 'success',
                isClosable: true,
              })}>
              <RiFileCopy2Fill style={{color: 'lightGrey'}} size={20} />
            </CopyToClipboard>
            {/* <Tooltip
              label="Add to cart"
              bg="white"
              placement={'top'}
              color={'gray.800'}
              fontSize={'1.2em'}>
              <chakra.a href={'#'} display={'flex'}>
                <Icon as={FiShoppingCart} h={7} w={7} alignSelf={'center'} />
              </chakra.a>
            </Tooltip> */}
          </Flex>

          <Flex justifyContent="space-between" alignContent="center">
            <Box fontSize="12" color={useColorModeValue('gray.800', 'white')}>
                {apiData.author_name}
            </Box>
          </Flex>
        </Box>
      </Box>
  );
}

export default ProductAddToCart;