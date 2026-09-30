const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'app', '[locale]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldStr = `  const newGames = randomGames(allGames.length, 8).map((item) => allGames[item]);
  const topGames = randomGames(allGames.length, 8).map((item) => allGames[item]);
  return (
    <Box bg="gray.900" minH="100vh">
      <Header hostname={hostname} categories={categories} />
      <Container
        maxWidth="container.xl"
        px={{ base: 3, md: 4, lg: 6 }}
        py={{ base: 4, md: 6 }}
      >
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <ElTemplate
            divId="div-gpt-ad-1782614717055-0"
            adUnitPath="/23358451472/.22"
            sizes={[[320, 100], [320, 50]]}
            minWidth={320}
            minHeight={100}
            style={{ marginBottom: '8px' }}
          />
          <ElTemplate
            divId="div-gpt-ad-1782614717055-1"
            adUnitPath="/23358451472/.22"
            sizes={[[320, 50], [320, 100]]}
            minWidth={320}
            minHeight={50}
          />
        </Box>`;

const newStr = `  const newGames = randomGames(allGames.length, 8).map((item) => allGames[item]);
  const topGames = randomGames(allGames.length, 8).map((item) => allGames[item]);
  const adInsertedGame = randomGames(allGames.length, 1).map((item) => allGames[item])[0];
  
  return (
    <Box bg="gray.900" minH="100vh">
      <Header hostname={hostname} categories={categories} />
      <Container
        maxWidth="container.xl"
        px={{ base: 3, md: 4, lg: 6 }}
        py={{ base: 4, md: 6 }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <ElTemplate
            divId="div-gpt-ad-1782614717055-0"
            adUnitPath="/23358451472/.22"
            sizes={[[320, 100], [320, 50]]}
            minWidth={320}
            minHeight={100}
            style={{ marginBottom: '8px' }}
          />
          {adInsertedGame && (
            <Box w={{ base: "320px", md: "100%" }} maxW="728px" mb="8px">
              <GameItem
                data={adInsertedGame}
                locale={locale}
                channel={searchParams?.channel}
              />
            </Box>
          )}
          <ElTemplate
            divId="div-gpt-ad-1782614717055-1"
            adUnitPath="/23358451472/.22"
            sizes={[[320, 50], [320, 100]]}
            minWidth={320}
            minHeight={50}
          />
        </Box>`;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated page.tsx');
} else {
  console.log('Old string not found in page.tsx');
}
