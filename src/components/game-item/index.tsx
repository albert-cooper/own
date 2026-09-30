import { Locale } from "@/i18n/routing";
import { GameRecord } from "@/services/data";
import { getTargetHref } from "@/utils";
import { AspectRatio, Box, Heading, LinkBox, LinkOverlay } from "@chakra-ui/react";
import Image from "next/image";

const GameItem = ({
  data,
  locale,
  channel,
}: {
  data: GameRecord;
  locale: Locale;
  channel?: string;
}) => {
  if(!data){
    return null;
  }
  return (
    <LinkBox
      bg="gray.800"
      border="1px solid"
      borderColor="gray.700"
      rounded={{ base: "lg", md: "xl" }}
      overflow="hidden"
      transition="transform 160ms ease, box-shadow 160ms ease"
      _hover={{ transform: "translateY(-4px)", boxShadow: "0 10px 20px rgba(0,0,0,0.3)", borderColor: "cyan.500" }}
    >
      <AspectRatio ratio={16 / 9}>
        <Image
          alt={data?.name}
          width={480}
          height={270}
          src={data?.image}
          priority={false}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AspectRatio>
      <Box px={3} py={2.5}>
        <LinkOverlay href={getTargetHref(locale, `/detail/${data.id}`, channel)}>
          <Heading
            as="h5"
            size="sm"
            lineHeight={1.4}
            color="gray.100"
            noOfLines={1}
            _hover={{ color: "cyan.400" }}
            transition="color 0.2s"
          >
            {data.name}
          </Heading>
        </LinkOverlay>
      </Box>
    </LinkBox>
  );
};

export default GameItem
