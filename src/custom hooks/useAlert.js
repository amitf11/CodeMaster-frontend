import Swal from 'sweetalert2'
import { utilService } from '../services/util.service'

const useAlert = () => {
  const showAlert = (msg) => {
    Swal.fire({
      title: utilService.capitalizeFirstLetter(msg.title),
      text: msg.text,
      icon: msg.icon,
      confirmButtonText: 'OK',
    })
  }

  const showConfirmation = (msg) => {
    return Swal.fire({
      title: utilService.capitalizeFirstLetter(msg.title),
      text: msg.text,
      icon: msg.icon || 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    })
  }

  return { showAlert, showConfirmation }
}

export default useAlert