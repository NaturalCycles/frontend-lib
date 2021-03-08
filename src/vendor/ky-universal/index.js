/*
This file simply re-exports `ky` for the Browser environment.
It is replaced by another file during build process to be used in CJS/Node/SSR environment (/dist).
 */
import ky from '../ky'

export default ky
