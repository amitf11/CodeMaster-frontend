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

  const showConfirm = (msg, callback) => { //TODO: Remove if not using
    Swal.fire({
      title: 'Confirm',
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        callback()
      }
    })
  }

  return { showAlert, showConfirm }
}

export default useAlert