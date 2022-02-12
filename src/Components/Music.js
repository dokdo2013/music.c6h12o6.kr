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
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';

function ProductAddToCart({apiData}) {
  console.log(apiData)
  return (
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        w="12%"
        minW="150"
        // maxW="160"
        borderWidth="1px"
        rounded="sm"
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

        <Image
          src={apiData.album_cover}
          alt={`Picture of ${apiData.music_name}`}
          roundedTop="lg"
        />

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
              fontSize="12"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated>
              {apiData.music_name}
            </Box>
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