import { MdeLanguage } from '../../components/language'
import { MdeTextApi, MdeTextState } from '../../typings/command-options'
import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  selectWord,
} from '../../util/markdown-util'
import { MdeCommandProps } from '../command'
export type AlterLineFunction = (line: string, index: number) => string
/**
 * Inserts insertionString before each line
 */
export function insertBeforeEachLine(
  selectedText: string,
  insertBefore: string | AlterLineFunction,
): { modifiedText: string; insertionLength: number } {
  const lines = selectedText.split(/\n/)
  let insertionLength = 0
  const modifiedText = lines
    .map((item, index) => {
      if (typeof insertBefore === 'string') {
        insertionLength += insertBefore.length
        return insertBefore + item
      } else if (typeof insertBefore === 'function') {
        const insertionResult = insertBefore(item, index)
        insertionLength += insertionResult.length
        return insertBefore(item, index) + item
      }
      throw Error('insertion is expected to be either a string or a function')
    })
    .join('\n')
  return { modifiedText, insertionLength }
}
export const makeList = (
  state0: MdeTextState,
  api: MdeTextApi,
  insertBefore: string | AlterLineFunction,
) => {
  // Adjust the selection to encompass the whole word if the caret is inside one
  const newSelectionRange = selectWord({
    text: state0.text,
    selection: state0.selection,
  })
  const state1 = api.setSelectionRange(newSelectionRange)
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
  const modifiedText = insertBeforeEachLine(state1.selectedText, insertBefore)
  api.replaceSelection(
    `${breaksBefore}${modifiedText.modifiedText}${breaksAfter}`,
  )
  // Specifically when the text has only one line, we can exclude the "- ", for example, from the selection
  const oneLinerOffset =
    state1.selectedText.indexOf('\n') === -1 ? modifiedText.insertionLength : 0
  const selectionStart =
    state1.selection.start + breaksBeforeCount + oneLinerOffset
  const selectionEnd =
    selectionStart + modifiedText.modifiedText.length - oneLinerOffset
  // Adjust the selection to not contain the **
  api.setSelectionRange({
    start: selectionStart,
    end: selectionEnd,
  })
}
export const unorderedListCommand = (): MdeCommandProps => ({
  buttonProps: {
    'aria-label': MdeLanguage.gettext('Add unordered list'),
    title: MdeLanguage.gettext('Add unordered list'),
  },
  execute: ({ initialState, textApi }) => {
    makeList(initialState, textApi, '- ')
  },
})
export const orderedListCommand = (): MdeCommandProps => ({
  buttonProps: {
    'aria-label': MdeLanguage.gettext('Add ordered list'),
    title: MdeLanguage.gettext('Add ordered list'),
  },
  execute: ({ initialState, textApi }) => {
    makeList(initialState, textApi, (item, index) => `${index + 1}. `)
  },
})
export const checkedListCommand = (): MdeCommandProps => ({
  buttonProps: {
    'aria-label': MdeLanguage.gettext('Add checked list'),
    title: MdeLanguage.gettext('Add checked list'),
  },
  execute: ({ initialState, textApi }) => {
    makeList(initialState, textApi, () => `- [] `)
  },
})
