package com.prefacepro.minstt;

import ai.api.AIConfiguration;
import ai.api.AIDataService;
import ai.api.model.AIRequest;
import ai.api.model.AIResponse;

public class AIApp {
    public static String processReq(String line) {
        System.setProperty("log4j2.disable.jmx", "true");

        AIConfiguration configuration = new AIConfiguration("ab9ae3bb3f994e35a0f1b667f374665d");
        AIDataService dataService = new AIDataService(configuration);
        String outJson = "";

        try {
            AIRequest request = new AIRequest(line);
            AIResponse response = dataService.request(request);

            if (response.getStatus().getCode() == 200) {
                //System.out.println(response.getResult().getFulfillment().getSpeech());
                //System.out.println(response.getResult().getAction());
                String action = response.getResult().getAction();
                String speech = response.getResult().getFulfillment().getSpeech();
                if(response.getResult().getAction().equals("OpenCall")) {
                    String appName = response.getResult().getParameters().get("app").getAsString();

                    outJson = "{\"action\": \"" + action + "\", \"app\": \"" + appName + "\", \"speech\": \"" + speech + "\"}";
                    //System.out.println(outJson);
                } else {
                    outJson = "{\"action\": \"\" + action + \"\", \"speech\": \"" + speech + "\"}";
                    //System.out.println(outJson);
                }
            } else {
                //System.err.println(response.getStatus().getErrorDetails());
            }
        } catch (Exception ex) {
            //ex.printStackTrace();
        }
        return outJson;
    }
}
