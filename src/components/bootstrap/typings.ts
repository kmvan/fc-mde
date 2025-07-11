import {
  ButtonHTMLAttributes,
  FC,
  ReactNode,
  RefObject,
  TextareaHTMLAttributes,
} from 'react'
import {
  MdeCommandMapProps,
  MdeGetIcon,
  type MdePasteOptions,
} from '../../commands/command.ts'
import { MdeGenerateMarkdownPreview } from '../../typings/function-types.ts'
import { MdeTabProps } from '../toolbar/typings.ts'
export interface MdeProps {
  text: string
  setText: (text: string) => void
  selectedTab: MdeTabProps
  onTabChange: (tab: MdeTabProps) => void
  generateMarkdownPreview: MdeGenerateMarkdownPreview
  refTextarea: RefObject<HTMLTextAreaElement | null>
  toolbarCommands?: string[][]
  commands?: MdeCommandMapProps
  getIcon?: MdeGetIcon
  loadingPreview?: ReactNode
  readOnly?: boolean
  disablePreview?: boolean
  writeButton?: ButtonHTMLAttributes<HTMLButtonElement>
  previewButton?: ButtonHTMLAttributes<HTMLButtonElement>
  commandButtons?: ButtonHTMLAttributes<HTMLButtonElement>
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>
  paste?: MdePasteOptions
  /**
   * Custom textarea component. "textareaComponent" can be any React component which
   * props are a subset of the props of an HTMLTextAreaElement
   */
  textareaComponent?: FC
  /**
   * Custom toolbar button component. "toolbarButtonComponent" can be any React component which
   * props are a subset of the props of an HTMLButtonElement
   */
  toolbarButtonComponent?: FC
}
