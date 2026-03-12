import { mainUrl } from "@/config";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

import {Upload as _Upload} from '@arco-design/web-react'
import { useEventListener } from "ahooks";
import { getImageUrl } from "@/utils/tools";

const MAX_FILE_SIZE = 500 * 1024; // 500k


const Upload = ({onChange, className, resetEventName}: any) => {
    useEventListener(resetEventName, ()=>{
        setFileList([])
    })

    const [fileList, setFileList] = useState([]);
    const uploadRef = useRef<any>();

    const onSubmit = () => {
        const file = fileList.filter((x: any) => x.status === 'init')[0];
        uploadRef.current && uploadRef.current.submit(file);
      };

    const _onChange = (files) => {
        setFileList(files);
    };

    useEffect(()=>{
        if(fileList){
            onSubmit?.()
        }
    }, [fileList?.map(i=>i?.uid)?.toString()])

    // [
    //   {
    //       "uid": "17158760617440",
    //       "originFile": {},
    //       "percent": 100,
    //       "status": "error",
    //       "name": "avatar.png",
    //       "response": ""
    //   }
    // ]
    const handleImgChange = async (option: any) => {
        const { onProgress, onError, onSuccess, file, ...props } = option;

        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size exceeds the 500KB limit');
            setFileList(() => []);

            return onError(new Error('File size exceeds the 500KB limit'));
        }

        const xhr = new XMLHttpRequest();

        if (xhr.upload) {
            xhr.upload.onprogress = function (event) {
                let percent: any;

                if (event.total > 0) {
                    percent = (event.loaded / event.total) * 100;
                }

                onProgress(parseInt(percent, 10), event);
            };
        }

        xhr.onerror = function error(e: any) {
            console.log('error', e)
            toast.error(e?.response?.data?.msg || e?.message || 'Upload Failed')
            onError(e);
        };

        xhr.onload = function onload() {
            if (xhr.status < 200 || xhr.status >= 300) {
                const e = JSON.parse(xhr.responseText)
                toast.error('Upload Failed: ' + e?.msg)
                return onError(xhr.responseText);
            }

            const res = JSON.parse(xhr.responseText)
            toast.success('Success')
            onChange()
            onChange?.(res?.data)
            onSuccess(xhr.responseText, xhr);
        };

        const formData = new FormData();
        formData.append(name || 'file', file);
        xhr.open('post', mainUrl + '/api/v1/upload', true);
        xhr.send(formData);
        return {
            abort() {
                xhr.abort();
            },
        };
    }

    return (<_Upload
        ref={uploadRef}
        onChange={_onChange}
        // onProgress={onProgress}
        fileList={fileList}
        autoUpload={false}
        customRequest={handleImgChange}
        className={clsx("size-[6rem]","rounded-[8px]", className)}
        limit={1}
        imagePreview
        // action='/'
        listType='picture-card'
        onPreview={(file) => {
            console.log('file', file)
        }}
        beforeUpload={(file) => {
            return new Promise((resolve, reject) => {
                if (file.size > MAX_FILE_SIZE) {
                    toast.error('File size exceeds the 500KB limit');
                    setFileList(() => []);
                    reject('File size exceeds the 500KB limit')
                }
                resolve(true)
            });
          }}
    >
        <div className="relative border border-[1.5px] border-[#FFFFFF33] hover:border-[#21E9FA] size-[7rem] rounded-full flex items-center justify-center flex-col">
            <img src={getImageUrl('@/assets/images/_global/upload.svg')}/>
            <div className="absolute bottom-0 -translate-y-1/2 left-1/2 -translate-x-1/2 text-sm text-[#A1A1AA]">{'<'}500KB</div>
        </div>
    </_Upload>)
}

export default Upload