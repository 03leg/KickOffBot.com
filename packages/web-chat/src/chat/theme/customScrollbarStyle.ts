export const customScrollbarStyle = `
.chat-box-root::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.chat-box-root::-webkit-scrollbar-track {
  background: transparent; 
}

.chat-box-root::-webkit-scrollbar-track:hover {
  background: #f1f1f17a; 
}
 
.chat-box-root::-webkit-scrollbar-thumb {
  background: #8080807a; 
}

.chat-box-root::-webkit-scrollbar-thumb:hover {
  background: #808080c9; 
}
` as const;
