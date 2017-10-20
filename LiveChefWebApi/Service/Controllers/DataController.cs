﻿using LiveChefService.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web.Hosting;
using System.Web.Http;

namespace LiveChefService.Controllers
{
    public class DataController : ApiController
   {
        public HttpResponseMessage Post(DataMessage message)
        {
            try
            {
                if (message.Type == EnumMessageType.START)
                {
                    var cookingMedia = new CookingMedia
                    {
                        CookingId = message.Id,
                        Status = MediaStreamTransfer.Started,
                        Data = new List<byte[]>()
                    };

                    WebApiApplication.CookingMediaRepository.Add(cookingMedia);
                }
                else if (message.Type == EnumMessageType.DATA)
                {
                    var cookingMedia = WebApiApplication.CookingMediaRepository.GetByCookingId(message.Id);

                    cookingMedia.Status = MediaStreamTransfer.Pending;
                    cookingMedia.Data.Add(message.Data);

                    WebApiApplication.CookingMediaRepository.Change(cookingMedia);
                }
                else if (message.Type == EnumMessageType.END)
                {
                    var cookingMedia = WebApiApplication.CookingMediaRepository.GetByCookingId(message.Id);
                    cookingMedia.Status = MediaStreamTransfer.Finished;

                    WebApiApplication.CookingMediaRepository.Change(cookingMedia);

                    var fileName = Path.Combine(HostingEnvironment.MapPath("~/Data"), String.Format("cooking-{0}.webm", cookingMedia.CookingId));

                    FileInfo f = new FileInfo(fileName);
                    using (FileStream fs = f.OpenWrite())
                    {
                        foreach (var data in cookingMedia.Data)
                        {
                            foreach (var block in data)
                            {
                                fs.WriteByte(block);
                            }
                        }
                    }
                }
                else
                {
                    throw new Exception("Unsupported message type");
                }

                string responseJson = JsonConvert.SerializeObject("");
                return Request.CreateResponse(HttpStatusCode.OK, responseJson);
            }
            catch (Exception ex)
            {
                // TODO log/trace error
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }
    }
}