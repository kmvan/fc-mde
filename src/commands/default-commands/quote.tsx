import { MdeLanguage } from '../../components/language'
import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  selectWord,
} from '../../util/markdown-util'
import { MdeCommandProps } from '../command'
export const quoteCommand = (): MdeCommandProps => ({
  buttonProps: {
    'aria-label': MdeLanguage.gettext('Insert a quote'),
    title: MdeLanguage.gettext('Insert a quote'),
  },
  execute: ({ initialState, textApi }) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({
      text: initialState.text,
      selection: initialState.selection,
    })
    const state1 = textApi.setSelectionRange(newSelectionRange)
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
    // Replaces the current selection with the quote mark up
    textApi.replaceSelection(
      `${breaksBefore}> ${state1.selectedText}${breaksAfter}`,
    )
    const selectionStart = state1.selection.start + breaksBeforeCount + 2
    const selectionEnd = selectionStart + state1.selectedText.length
    textApi.setSelectionRange({
      start: selectionStart,
      end: selectionEnd,
    })
  },
})
