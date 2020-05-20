# What is MC Debug Profiler

Simply put, if you run `/debug start` and let it go for a bit then run `/debug stop` minecraft will output a log file of what took up the most time on your server over the course of the profiling. The file is a bit dense but I like visualizing data and this is a pretty easy way of collecting some interesting information.

## What's the plan?

* Develop a node injestion point that converts the file in to structured data
* Develop a d3 visualization of the profile with the ability to click in to each subsequent data point and see what it taking up the most time on the server
* If this works well enough, I might add additional features such as trend analysis and such