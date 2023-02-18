import { Flex, Paper, Title, TextInput, Button } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useRef, useState } from 'react';

function App() {
  const [value, setValue] = useState<string>('')
  const inputReference = useRef(null);
  const clipboard = useClipboard({ timeout: 500 });

  const handleShortIt = () => {
    if (value.length > 2048) {
      return showNotification({
        message: 'URL is too long',
      });
    }

    if (!new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g).test(value)) {
      return showNotification({
        message: 'It is not a valid URL',
      });
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "url": value
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:3000/createLink", requestOptions)
      .then(response => response.json())
      .then(result => {
        showNotification({
          message: "Your URL Shortened and Copied!",
        });
        setValue(`http://localhost:3000/${result.message.accessToken}`);
        clipboard.copy(value);
        (inputReference?.current as any).select();

      })
      .catch(error => console.log('error', error));
  }

  return (
    <Flex
      mih={50}
      gap="lg"
      justify="flex-start"
      align="center"
      direction="column"
    >
      <Title>SHRT.IO</Title>

      <Paper shadow="xs" radius="lg" p="md" withBorder>
        <Flex
          mih={50}
          gap="lg"
          justify="flex-start"
          align="center"
          direction="column"
        >
          <TextInput label="Your URL" value={value} ref={inputReference} onClick={() => {
            (inputReference?.current as any).select();
            clipboard.copy(value);

          }} onChange={(e) => {
            setValue(e.currentTarget.value)
          }} placeholder="https://example.com" size="md" />
          <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} onClick={() => handleShortIt()}>Short It!</Button>
        </Flex>

      </Paper>
    </Flex>
  )
}

export default App
