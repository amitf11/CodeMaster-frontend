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

  return { showAlert }
}

export default useAlert