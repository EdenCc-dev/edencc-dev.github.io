import { PT12Wrapper } from "@/components/Wrappers"
import { useMemo } from "react"
import contentText from "./content.json?raw"

const parseContent = (text: string) => {
    const lines = text.split('\n')
    const result: Array<{ type: 'mainTitle' | 'title' | 'heading' | 'headingWithDesc' | 'headingWithValue' | 'text' | 'list', content: string, description?: string[], value?: string, level?: number }> = []
    let inStepsSection = false
    let isFirstLine = true
    let inObjectiveSection = false
    let objectiveDescription: string[] = []
    let inFinalCohortSection = false
    let inDeliverablesSection = false
    
    for (let i = 0; i < lines.length; i++) {
        const originalLine = lines[i]
        const line = originalLine.trim()
        
        if (!line) {
            // 忽略所有空行，因为CSS已经提供了足够的间距
            if (isFirstLine) isFirstLine = false
            continue
        }
        
        // 第一行是主标题
        if (isFirstLine) {
            result.push({ type: 'mainTitle', content: line })
            isFirstLine = false
            continue
        }
        
        // 检测二级标题 (Phase 1, Phase 2, Phase 3, Final Cohort, Expected Outcomes)
        if (line.startsWith('Phase') || line.startsWith('Final Cohort') || line.startsWith('Expected Outcomes')) {
            // 如果在Objective部分，先保存之前的Objective
            if (inObjectiveSection && objectiveDescription.length > 0) {
                result.push({ type: 'headingWithDesc', content: 'Objective', description: [...objectiveDescription] })
                objectiveDescription = []
                inObjectiveSection = false
            }
            result.push({ type: 'title', content: line, level: 1 })
            inStepsSection = false
            // 标记是否在 Final Cohort 部分
            inFinalCohortSection = line.startsWith('Final Cohort')
            inDeliverablesSection = false
        }
        // 检测Objective - 特殊处理
        else if (line.match(/^Objective:?$/i)) {
            inObjectiveSection = true
            objectiveDescription = []
        }
        // 检测 Final Cohort 下的副标题（Total Ambassadors, Total Monthly Cost, Deliverables）
        else if (inFinalCohortSection && line.match(/^(Total Ambassadors|Total Monthly Cost|Deliverables):/i)) {
            // 如果在Objective部分，先保存Objective
            if (inObjectiveSection && objectiveDescription.length > 0) {
                result.push({ type: 'headingWithDesc', content: 'Objective', description: [...objectiveDescription] })
                objectiveDescription = []
                inObjectiveSection = false
            }
            const parts = line.split(':')
            const headingName = parts[0].trim()
            const value = parts.length > 1 ? parts.slice(1).join(':').trim() : ''
            
            // 如果是 Deliverables，使用普通标题，并进入列表模式
            if (headingName.toLowerCase() === 'deliverables') {
                result.push({ type: 'heading', content: headingName, level: 2 })
                inDeliverablesSection = true
            } else {
                // Total Ambassadors 和 Total Monthly Cost 使用带值的标题
                result.push({ type: 'headingWithValue', content: headingName, value: value, level: 2 })
                inDeliverablesSection = false
            }
            inStepsSection = false
        }
        // 检测三级标题 (Goal, Steps, Purpose, Timeline，但不包括Objective和Final Cohort下的标题)
        else if (line.match(/^(Goal|Steps|Purpose|Timeline):?$/i)) {
            // 如果在Objective部分，先保存Objective
            if (inObjectiveSection && objectiveDescription.length > 0) {
                result.push({ type: 'headingWithDesc', content: 'Objective', description: [...objectiveDescription] })
                objectiveDescription = []
                inObjectiveSection = false
            }
            result.push({ type: 'heading', content: line.replace(':', ''), level: 2 })
            inStepsSection = line.toLowerCase().includes('steps')
            inFinalCohortSection = false
            inDeliverablesSection = false
        }
        // 检测列表项（Base:, Optional: 等键值对，但排除 Final Cohort 下的标题）
        else if (line.match(/^(Base|Optional):/i)) {
            // 如果在Objective部分，先保存Objective
            if (inObjectiveSection && objectiveDescription.length > 0) {
                result.push({ type: 'headingWithDesc', content: 'Objective', description: [...objectiveDescription] })
                objectiveDescription = []
                inObjectiveSection = false
            }
            result.push({ type: 'list', content: line })
            inStepsSection = false
        }
        // 检测 Deliverables 下的列表项
        else if (inDeliverablesSection) {
            result.push({ type: 'list', content: line })
        }
        // 检测步骤项（在 Steps: 之后的内容，直到遇到 Purpose: 或其他标题）
        else if (inStepsSection) {
            result.push({ type: 'list', content: line })
        }
        // Objective的描述段落
        else if (inObjectiveSection) {
            objectiveDescription.push(line)
        }
        // Final Cohort 下的其他内容（不会到达这里，因为前面已经处理了所有情况）
        // 普通文本段落
        else {
            result.push({ type: 'text', content: line })
            inStepsSection = false
        }
    }
    
    // 处理文件末尾的Objective描述
    if (inObjectiveSection && objectiveDescription.length > 0) {
        result.push({ type: 'headingWithDesc', content: 'Objective', description: [...objectiveDescription] })
    }
    
    return result
}

export const AmbassadorPage = () => {
    const parsedContent = useMemo(() => parseContent(contentText), [])
    
    return (
        <PT12Wrapper className="max-w-4xl mx-auto px-4">
            <div className="prose prose-invert max-w-none text-base">
                {parsedContent.map((item, index) => {
                    // 主标题 - 最大的标题
                    if (item.type === 'mainTitle') {
                        return (
                            <h1
                                key={index}
                                className="text-4xl lg:text-5xl font-bold mb-8 text-white text-center"
                            >
                                {item.content}
                            </h1>
                        )
                    }
                    
                    // 二级标题 - Phase 1, Phase 2等
                    if (item.type === 'title') {
                        // 如果是 Phase 1，在标题前插入图片
                        const isPhase1 = item.content.startsWith('Phase 1')
                        return (
                            <div key={index}>
                                {isPhase1 && (
                                    <div className="mb-8 -mx-4">
                                        <img
                                            src="/ambassador/banner.png"
                                            alt="CyRunners Network Banner"
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </div>
                                )}
                                <h2
                                    className="text-2xl lg:text-3xl font-bold mt-10 mb-4 text-white"
                                >
                                    {item.content}
                                </h2>
                            </div>
                        )
                    }
                    
                    // 带描述的标题 - Objective
                    if (item.type === 'headingWithDesc') {
                        return (
                            <div key={index} className="mt-6 mb-6 text-center">
                                <h3 className="text-xl font-semibold mb-3 text-white">
                                    {item.content}
                                </h3>
                                {item.description && item.description.map((desc, descIndex) => (
                                    <p
                                        key={descIndex}
                                        className="mb-3 text-gray-300 leading-relaxed"
                                    >
                                        {desc}
                                    </p>
                                ))}
                            </div>
                        )
                    }
                    
                    // 带值的标题 - Total Ambassadors, Total Monthly Cost
                    if (item.type === 'headingWithValue') {
                        return (
                            <div key={index} className="mt-6 mb-3">
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    {item.content}
                                </h3>
                                {item.value && (
                                    <p className="text-gray-300 leading-relaxed">
                                        {item.value}
                                    </p>
                                )}
                            </div>
                        )
                    }
                    
                    // 三级标题 - Goal, Steps, Purpose, Deliverables等
                    if (item.type === 'heading') {
                        return (
                            <h3
                                key={index}
                                className="text-xl font-semibold mt-6 mb-3 text-white"
                            >
                                {item.content}
                            </h3>
                        )
                    }
                    
                    // 列表项
                    if (item.type === 'list') {
                        return (
                            <div
                                key={index}
                                className="ml-6 mb-2 text-gray-300 flex items-start"
                            >
                                <span className="mr-2 mt-1">•</span>
                                <span className="flex-1">{item.content}</span>
                            </div>
                        )
                    }
                    
                    // 普通文本段落
                    return (
                        <p
                            key={index}
                            className="mb-4 text-gray-300 leading-relaxed"
                        >
                            {item.content}
                        </p>
                    )
                })}
            </div>
        </PT12Wrapper>
    )
}
