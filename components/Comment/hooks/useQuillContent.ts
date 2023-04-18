import { useEffect, useState, useCallback } from "react";
import Quill from "quill";
import Delta from 'quill-delta/lib/delta';
import { isEmpty } from "~/config/utils/nullchecks";
import debounce from "lodash/debounce";
import { DeltaOperation } from 'quill-delta';

type Args = {
  quill: Quill | undefined;
  content: object;
  notifyOnContentChangeRate: number;
};






// // Create a custom lexer
// class CustomLexer extends marked.Lexer {
//   constructor(options) {
//     super(options);
//   }

//   // Override the `token` method
//   token(src, top) {
//     // Check if the current token is a code block
//     const match = this.rules.block.fences.exec(src);
//     if (match) {
//       // Get the code block content and language
//       const content = match[3];
//       const language = (match[2] || '').trim();

//       // Create an object with the code and language properties
//       const codeObject = {
//         code: content,
//         language: language
//       };

//       // Return the code object instead of the default token
//       return [Object.assign(new marked.Token(), {
//         type: 'code_object',
//         raw: match[1],
//         text: content,
//         lang: language,
//         codeObject: codeObject
//       })];
//     }

//     // Call the original `token` method for all other cases
//     return super.token(src, top);
//   }
// }



// // Use the custom lexer
// marked.use({ Lexer: CustomLexer });



const useQuillContent = ({ quill, notifyOnContentChangeRate, content = {} }: Args) => {
  const [_content, setContent] = useState<object>(content);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const debouncedSetContent = useCallback(debounce((c) => setContent(c), notifyOnContentChangeRate), [_content])



  useEffect(() => {

    if (!quill) return;




    
    quill.keyboard.addBinding(
      {
        key: ' ',
        handler: (range, context) => {

              // Get the blot before the space
              const editorLength = quill.getLength();
              const [blotBefore, offsetBefore] = quill.getLeaf(editorLength - 2);
              const currentPosition = quill.getSelection().index;

              console.log(blotBefore)
              if (blotBefore.constructor.name === "FormulaBlot") {
                console.log('111')
                quill.insertText(currentPosition, ' ');
                return true;
              }

              return true



        },
      },
    );

  }, [quill])
  

  useEffect(() => {
    
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
          const nextContent: Delta = quill.getContents();
          const lastDelta: DeltaOperation = nextContent.ops[nextContent.ops.length-1];




          // const currentPosition = quill.getSelection().index;
          // const deltaBeforeLast = nextContent.ops[nextContent.ops.length-2]

          // if (deltaBeforeLast.insert.formula) {
          //   console.log('formula')
          //   console.log('lastDelta', lastDelta)
          // }

          // console.log('deltaBeforeLast' , deltaBeforeLast)
          



          // // Get the content of Quill editor before the current cursor position
          // const range = quill.getSelection()
          // const precedingContent = quill.getContents(0, range!.index);
    
          // console.log('precedingContent', precedingContent);


          // // Check if the last inserted content is a formula
          // const isFormula = precedingContent.ops.some(op => op.insert && op.insert.formula);
    
          // if (isFormula) {
          //   // If the preceding content is a formula, insert a space and update the cursor position
          //   console.log('it is a formula', range.index)



          //   quill.insertText(range.index, '\u200B');
            
          //   // quill.setSelection(range.index + 1, 'silent');
          //   return false;
          // }











          if (typeof(lastDelta.insert) === "string") {
            const currentString = lastDelta.insert
            const codeBlockRegex = /```(?:\r?\n|\r)?$/;
            const codeInlineRegex = /(?<!`)`([^`\r\n]+)`(?!`)/g
            


            
            let regexMatch;
            if ((regexMatch = currentString.match(codeBlockRegex))) {
              // 1. Create the Delta for the code block without tick marks
              const codeBlockDelta = new Delta().insert("\n").insert('\n', { 'code-block': true });

              // 2. Get the current length of the editor's content
              const editorLength = quill.getLength();

              // 3. Insert the code block Delta at the end of the editor
              quill.updateContents(new Delta().retain(editorLength - 1).concat(codeBlockDelta), 'silent');

              // 4. Set the cursor position to the end of the editor
              quill.setSelection(editorLength + codeBlockDelta.length() - 2, 0);

              // 5. Focus the editor
              quill.focus();

              // 6. Remove the tick marks
              const tickMarksLength = 3;
              quill.deleteText(editorLength - tickMarksLength - 1, tickMarksLength, 'silent');
            }
            else if ((regexMatch = currentString.match(codeInlineRegex))) {
              console.log('Match!!!!!', regexMatch)

              const matchWithTicks = regexMatch[0];
              const regex = new RegExp("`", "g");

              const matchWithoutTicks = matchWithTicks.replace(regex, "")
              const delta = new Delta().insert("").insert(matchWithoutTicks, { 'code': true }).insert("\u200B");

              const editorLength = quill.getLength();
              quill.updateContents(new Delta().retain(editorLength - 1).concat(delta), 'silent');              

              // 4. Set the cursor position to the end of the editor
              quill.setSelection(editorLength + delta.length() - 1, 0);

              // 5. Focus the editor
              quill.focus();


              quill.deleteText(editorLength - matchWithTicks.length - 1, matchWithTicks.length, 'silent');              


              



            }

          }
          
          


          debouncedSetContent(nextContent);
        }
      });
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      if (!isInitialized && !isEmpty(content)) {
        // @ts-ignore
        quill!.setContents(content);
        debouncedSetContent(content);
      }

      setIsInitialized(true);
    }
  }, [isInitialized, content, quill]);

  return {
    content: _content,
    dangerouslySetContent: (content) => {
      quill!.setContents(content);
      setContent(content);
    },
  };
};

export default useQuillContent;
