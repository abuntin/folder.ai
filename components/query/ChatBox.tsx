'use client';

import * as React from 'react';
import { Box, Unstable_Grid2 as Grid, IconButton } from '@mui/material';
import { SendSharp, CloseSharp } from '@mui/icons-material';
import { borderRadius, padding, margin } from 'lib/constants';
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
        maxWidth: 300,
        ml: src == 'query' ? 0 : 'auto',
        mr: src == 'user' ? 0 : 'auto',
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
    if (inputText.length == 0) {
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
    <Box
      sx={{
        backgroundColor: 'background.default',
        borderRadius: borderRadius * 2,
        padding: padding * 2,
        flex: 1,
        height: '100%'
      }}
    >
      <Grid container direction="column">
        <Grid xs={10}>
          <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {messages.map(({ text, src }, i) => messageBox(text, src, `${i}`))}
          </Box>
        </Grid>
        <Grid
          xs
          display="flex"
          flexDirection="row"
          justifyContent="space-evenly"
        >
          <form
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onSubmit={e => {
              e.preventDefault();
              sendQuery(e);
            }}
          >
            <DInput
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
              sx={{ display: 'flex', alignItems: 'flex-end' }}
              value={inputText}
            >
              <IconButton>
                <CloseSharp sx={{ fontSize: 10 }} color="primary" />
              </IconButton>
            </DInput>

            <IconButton onClick={sendQuery} type="submit">
              <SendSharp sx={{ fontSize: 16 }} color="primary" />
            </IconButton>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};
