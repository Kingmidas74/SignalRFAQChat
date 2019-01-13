using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;

[assembly: OwinStartup(typeof(FAQChat.Startup))]

namespace FAQChat
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);

            app.MapSignalR(new HubConfiguration
            {
                EnableDetailedErrors = true,
                EnableJSONP = true,
                EnableJavaScriptProxies = true
            });
        }
    }
}
