'use client';

import * as React from 'react';
import { Box, IconButton } from '@mui/material';
import { SendSharp, CloseSharp } from '@mui/icons-material';
import { borderRadius, borderWidth, padding, margin } from 'lib/constants';
import { DInput, DText } from 'components/common';

interface ChatBoxProps {}

export const ChatBox: React.FC<ChatBoxProps> = props => {
  const [messages, setMessages] = React.useState<
    {
      text: string;
      src: 'user' | 'query';
    }[]
  >([]);

  const [inputText, setInputText] = React.useState('');

  const messageBox = (text: string, src: 'user' | 'query', key = 'message') => (
    <Box
      key={key}
      sx={{
        borderRadius,
        padding,
        backgroundColor: src == 'user' ? 'background.paper' : 'info.main',
        mb: margin,
        width: 'auto',
        maxWidth: 400,
        mr: src == 'user' ? margin : 0,
        alignSelf: src == 'user' ? 'flex-end' : 'flex-start',
        position: 'relative',
        float: src == 'user' ? 'right' : 'left',
      }}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="start"
    >
      <DText text={text} variant="body2" />
    </Box>
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setInputText(e.target.value);

  const sendQuery = (e: React.SyntheticEvent) => {
    if (inputText == '') {
      alert('Missing Input string');
      return;
    }

    let int = Math.floor(Math.random() * 10);

    setMessages([
      ...messages,
      {
        text: inputText,
        src: (int % 2 == 0 ? 'user' : 'query') as 'user' | 'query',
      },
    ]);

    setInputText('');
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        flexShrink={1}
        flexBasis="auto"
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          height: '80%',
          mb: margin * 2,
          borderWidth,
          borderRadius,
          padding: padding * 2,
        }}
      >
        {messages.map(({ text, src }, i) => messageBox(text, src, `${i}`))}
      </Box>
      <Box
        display="flex"
        flexGrow={0}
        flexShrink={1}
        flexBasis="auto"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="stretch"
      >
        <DInput
          fullWidth
          variant="outlined"
          onChange={handleInputChange}
          onKeyDown={e => e.key == 'Enter' && sendQuery(e)}
          sx={{ mr: margin }}
          value={inputText}
          InputProps={{
            endAdornment: (
              <IconButton onClick={e => setInputText('')}>
                <CloseSharp sx={{ fontSize: 10 }} color="primary" />
              </IconButton>
            ),
          }}
        />
        <IconButton onClick={sendQuery} type="submit">
          <SendSharp sx={{ fontSize: 16 }} color="primary" />
        </IconButton>
      </Box>
    </>
  );
};
