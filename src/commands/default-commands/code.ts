import { MdeLanguage } from '../../components/language/index.ts'
import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  selectWord,
} from '../../utils/markdown-util.ts'
import { MdeCommandProps } from '../command.ts'
export const codeCommand = (): MdeCommandProps => ({
  buttonProps: {
    'aria-label': MdeLanguage.gettext('Insert code'),
    title: MdeLanguage.gettext('Insert code'),
  },
  execute: ({ initialState, textApi, setText }) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({
      text: initialState.text,
      selection: initialState.selection,
    })
    const state1 = textApi.setSelectionRange(newSelectionRange)
    // when there's no breaking line
    if (state1.selectedText.indexOf('\n') === -1) {
      textApi.replaceSelection(`\`${state1.selectedText}\``)
      // Adjust the selection to not contain the **
      const selectionStart = state1.selection.start + 1
      const selectionEnd = selectionStart + state1.selectedText.length
      textApi.setSelectionRange({
        start: selectionStart,
        end: selectionEnd,
      })
      return
    }
    const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
      state1.text,
      state1.selection.start,
    )
    const breaksBefore = Array(breaksBeforeCount + 1).join('\n')
    const breaksAfterCount = getBreaksNeededForEmptyLineAfter(
      state1.text,
      state1.selection.end,
    )
    const breaksAfter = Array(breaksAfterCount + 1).join('\n')
    textApi.replaceSelection(
      `${breaksBefore}\`\`\`\n${state1.selectedText}\n\`\`\`${breaksAfter}`,
    )
    const selectionStart = state1.selection.start + breaksBeforeCount + 4
    const selectionEnd = selectionStart + state1.selectedText.length
    setText(
      textApi.setSelectionRange({
        start: selectionStart,
        end: selectionEnd,
      }).text,
    )
  },
})
