import { MdeLanguage } from '../../components/language/index.ts'
import { selectWord } from '../../utils/markdown-util.ts'
import { MdeCommandProps } from '../command.ts'
export const imageCommand = (): MdeCommandProps => ({
  buttonProps: {
    'aria-label': MdeLanguage.gettext('Add image'),
    title: MdeLanguage.gettext('Add image'),
  },
  execute: ({ initialState, textApi, setText }) => {
    // Replaces the current selection with the whole word selected
    const state1 = textApi.setSelectionRange(
      selectWord({
        text: initialState.text,
        selection: initialState.selection,
      }),
    )
    // Replaces the current selection with the image
    const imageTemplate =
      state1.selectedText || 'https://example.com/your-image.png'
    textApi.replaceSelection(`![](${imageTemplate})`)
    // Adjust the selection to not contain the **
    setText(
      textApi.setSelectionRange({
        start: state1.selection.start + 4,
        end: state1.selection.start + 4 + imageTemplate.length,
      }).text,
    )
  },
})
