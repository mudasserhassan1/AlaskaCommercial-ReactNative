import {BLOB_URLS} from '../constants/Api';
import {IMAGES} from '../theme';

export const getDefaultImageUrl = (isLowBandwidth, isDetails) => {
  if (isDetails) {
    return isLowBandwidth ? IMAGES.LOGO_LR_MN_SYN : IMAGES.LOGO_HR_MN_SYN;
  }
  return isLowBandwidth ? IMAGES.LOGO_LR_TN_SYN : IMAGES.LOGO_HR_TN_SYN;
};

export const getImageUrl = (sku, isLowBandwidth) => {
  return `${BLOB_URLS.THUMBNAIL_IMAGE_URL}${sku}${
    isLowBandwidth ? BLOB_URLS.LR_THUMBNAIL_IMAGE_END_URL : BLOB_URLS.HR_THUMBNAIL_IMAGE_END_URL
  }`;
};

export const getDeptIcon = deptId => {
  let newDeptId;
  if (!Number.isNaN(parseInt(deptId))) {
    newDeptId = ('000' + parseInt(deptId)).substr(-3);
  } else {
    newDeptId = deptId;
  }

  return BLOB_URLS.DEPT_ICON_URL + newDeptId + '.png';
};

export const getDetailImageUrl = (sku, isLowBandwidth) => {
  return `${BLOB_URLS.MAIN_IMAGE_URL}${sku}${
    isLowBandwidth ? BLOB_URLS.LR_MAIN_IMAGE_END_URL : BLOB_URLS.HR_MAIN_IMAGE_END_URL
  }`;
};
